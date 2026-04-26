// netlify/functions/stripe-webhook.cjs
// Handles Stripe webhook events for LaunchPilot payments and subscriptions

const Stripe = require('stripe')
const { createClient } = require('@supabase/supabase-js')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Sentinel for webhook events we cannot recover from (bad/missing metadata).
// Outer handler converts this to a 200 so Stripe stops retrying.
class UnrecoverableWebhookError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UnrecoverableWebhookError'
  }
}

let supabase = null
try {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.VITE_SUPABASE_URL) {
    supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  }
} catch (err) {
  console.warn('[stripe-webhook] Failed to initialize Supabase:', err.message)
}

/**
 * Upsert subscription record in Supabase
 */
async function upsertSubscription(userId, data) {
  if (!supabase) {
    console.error('[stripe-webhook] Supabase not configured')
    return
  }

  // Check if subscription exists for this user + app
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .eq('app', 'launchpilot')
    .single()

  const record = {
    user_id: userId,
    app: 'launchpilot',
    ...data,
    updated_at: new Date().toISOString()
  }

  if (existing) {
    const { error } = await supabase
      .from('subscriptions')
      .update(record)
      .eq('id', existing.id)

    if (error) {
      console.error('[stripe-webhook] Failed to update subscription:', error.message)
      throw error
    }
    console.log('[stripe-webhook] Subscription updated for user:', userId)
  } else {
    record.created_at = new Date().toISOString()
    const { error } = await supabase
      .from('subscriptions')
      .insert([record])

    if (error) {
      console.error('[stripe-webhook] Failed to insert subscription:', error.message)
      throw error
    }
    console.log('[stripe-webhook] Subscription created for user:', userId)
  }
}

/**
 * Handle checkout.session.completed
 * Fires for both one-time payments (Launcher) and subscription starts (Pro)
 */
async function handleCheckoutCompleted(session) {
  const userId = session.metadata?.supabase_user_id
  if (!userId) {
    throw new UnrecoverableWebhookError('Missing supabase_user_id in session metadata')
  }

  const tier = session.metadata?.tier
  const isSubscription = session.mode === 'subscription'

  // current_period_end is NOT NULL in the DB. For one-time purchases there is
  // no real expiry — we omit the field so the column default (now() + 1 month)
  // fires. Readers must distinguish "lifetime" via purchase_type='one_time',
  // never via current_period_end.
  const subscriptionData = {
    tier: tier || (isSubscription ? 'pro' : 'launcher'),
    stripe_customer_id: session.customer,
    stripe_subscription_id: isSubscription ? session.subscription : null,
    stripe_price_id: null,
    purchase_type: isSubscription ? 'subscription' : 'one_time',
    status: 'active',
    current_period_start: new Date().toISOString()
  }

  // Subscriptions: pull real period_end from Stripe.
  // One-time purchases: leave field unset → DB default applies.
  if (session.subscription && isSubscription) {
    try {
      const sub = await stripe.subscriptions.retrieve(session.subscription)
      subscriptionData.stripe_price_id = sub.items.data[0]?.price?.id || null
      subscriptionData.current_period_end = new Date(sub.current_period_end * 1000).toISOString()
    } catch (err) {
      console.warn('[stripe-webhook] Could not retrieve subscription details:', err.message)
    }
  }

  await upsertSubscription(userId, subscriptionData)

  // Record in payments table — idempotent on provider_payment_id so Stripe
  // webhook retries don't create duplicate rows.
  if (supabase) {
    const providerPaymentId = session.payment_intent || session.subscription
    if (!providerPaymentId) {
      console.warn('[stripe-webhook] No payment_intent or subscription id on session — skipping payments row')
    } else {
      const { data: existing, error: lookupError } = await supabase
        .from('payments')
        .select('id')
        .eq('provider_payment_id', providerPaymentId)
        .maybeSingle()

      if (lookupError) {
        // Transient — let it bubble so Stripe retries.
        throw lookupError
      }

      if (existing) {
        console.log('[stripe-webhook] Duplicate payment skipped:', providerPaymentId)
      } else {
        const { error: insertError } = await supabase.from('payments').insert([{
          user_id: userId,
          amount: session.amount_total / 100,
          status: 'completed',
          provider: 'stripe',
          provider_payment_id: providerPaymentId,
          payment_type: isSubscription ? 'subscription' : 'one_time',
          metadata: { tier, session_id: session.id, app: 'launchpilot' }
        }])
        if (insertError) throw insertError
      }
    }
  }

  console.log('[stripe-webhook] Checkout completed:', { userId, tier, mode: session.mode })
}

/**
 * Handle customer.subscription.updated
 * Fires when subscription status changes (renewal, card update, etc.)
 */
async function handleSubscriptionUpdated(subscription) {
  const userId = subscription.metadata?.supabase_user_id
  if (!userId) {
    throw new UnrecoverableWebhookError(
      `No supabase_user_id in subscription ${subscription.id} metadata`
    )
  }

  await upsertSubscription(userId, {
    status: subscription.cancel_at_period_end ? 'cancelled' : subscription.status === 'active' ? 'active' : subscription.status,
    stripe_subscription_id: subscription.id,
    stripe_price_id: subscription.items.data[0]?.price?.id || null,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    cancelled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null
  })

  console.log('[stripe-webhook] Subscription updated:', subscription.id, 'status:', subscription.status)
}

/**
 * Handle customer.subscription.deleted
 * Fires when subscription is fully canceled (period ended)
 * Downgrade to launcher if they have a prior one-time purchase, else free
 */
async function handleSubscriptionDeleted(subscription) {
  const userId = subscription.metadata?.supabase_user_id
  if (!userId) {
    throw new UnrecoverableWebhookError(
      `No supabase_user_id in subscription ${subscription.id} metadata`
    )
  }

  // Check if user has a prior Launcher (one-time) purchase
  let downgradeToTier = 'free'
  if (supabase) {
    const { data: payments } = await supabase
      .from('payments')
      .select('id')
      .eq('user_id', userId)
      .eq('payment_type', 'one_time')
      .eq('status', 'completed')
      .limit(1)

    if (payments && payments.length > 0) {
      downgradeToTier = 'launcher'
    }
  }

  await upsertSubscription(userId, {
    tier: downgradeToTier,
    status: downgradeToTier === 'free' ? 'expired' : 'active',
    stripe_subscription_id: null,
    purchase_type: downgradeToTier === 'launcher' ? 'one_time' : 'subscription',
    cancelled_at: new Date().toISOString()
  })

  console.log('[stripe-webhook] Subscription deleted, downgraded to:', downgradeToTier)
}

/**
 * Handle invoice.payment_failed
 */
async function handlePaymentFailed(invoice) {
  const subscriptionId = invoice.subscription
  if (!subscriptionId) return

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const userId = subscription.metadata?.supabase_user_id
  if (!userId) {
    throw new UnrecoverableWebhookError(
      `No supabase_user_id in subscription ${subscriptionId} metadata`
    )
  }

  await upsertSubscription(userId, { status: 'past_due' })
  console.log('[stripe-webhook] Payment failed for subscription:', subscriptionId)
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  // Verify webhook signature
  const sig = event.headers['stripe-signature']
  if (!sig) {
    console.error('[stripe-webhook] Missing stripe-signature header')
    return { statusCode: 400, body: 'Missing signature' }
  }

  let stripeEvent
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('[stripe-webhook] Signature verification failed:', err.message)
    return { statusCode: 400, body: `Webhook signature verification failed: ${err.message}` }
  }

  console.log('[stripe-webhook] Event received:', stripeEvent.type, stripeEvent.id)

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(stripeEvent.data.object)
        break

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(stripeEvent.data.object)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(stripeEvent.data.object)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(stripeEvent.data.object)
        break

      default:
        console.log('[stripe-webhook] Unhandled event type:', stripeEvent.type)
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ received: true })
    }
  } catch (error) {
    // Unrecoverable: event can never succeed on retry (missing metadata, etc.).
    // Ack with 200 so Stripe stops retrying, but log loudly.
    if (error instanceof UnrecoverableWebhookError) {
      console.error('[stripe-webhook] Unrecoverable, acknowledging:', error.message, 'event:', stripeEvent.id)
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ received: true, skipped: error.message })
      }
    }

    // Transient (DB, network, Stripe API): return 500 so Stripe retries.
    // Stripe backs off for ~3 days — this is the safety net against
    // silent payment-without-upgrade.
    console.error('[stripe-webhook] Transient error, returning 500 for retry:', error.message, 'event:', stripeEvent.id)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal webhook error' })
    }
  }
}
