// netlify/functions/stripe-checkout.cjs
// Creates a Stripe Checkout Session for Launcher ($29 one-time) or Pro ($9/mo subscription)

const Stripe = require('stripe')
const { createClient } = require('@supabase/supabase-js')
const { verifyAuth, getCorsOrigin } = require('./utils/auth.cjs')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

let supabase = null
try {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.VITE_SUPABASE_URL) {
    supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  }
} catch (err) {
  console.warn('[stripe-checkout] Failed to initialize Supabase:', err.message)
}

// Map price IDs to checkout modes
const PRICE_CONFIG = {
  [process.env.VITE_STRIPE_LAUNCHER_PRICE_ID]: { mode: 'payment', tier: 'launcher' },
  [process.env.VITE_STRIPE_PRO_PRICE_ID]: { mode: 'subscription', tier: 'pro' }
}

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': getCorsOrigin(event),
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: ''
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    }
  }

  try {
    // Verify authentication
    const { userId, user } = await verifyAuth(event)

    // Parse request
    const { priceId } = JSON.parse(event.body || '{}')
    if (!priceId) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({ error: 'Missing priceId' })
      }
    }

    const config = PRICE_CONFIG[priceId]
    if (!config) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({ error: 'Invalid priceId' })
      }
    }

    // Find or create Stripe customer
    let stripeCustomerId = null

    if (supabase) {
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('stripe_customer_id')
        .eq('user_id', userId)
        .eq('app', 'launchpilot')
        .single()

      stripeCustomerId = subData?.stripe_customer_id
    }

    if (!stripeCustomerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: userId,
          app: 'launchpilot'
        }
      })
      stripeCustomerId = customer.id
    }

    // Determine success/cancel URLs
    const origin = event.headers?.origin || 'https://launchpilot.marketing'
    const successUrl = `${origin}/dashboard?checkout=success`
    const cancelUrl = `${origin}/pricing`

    // Build checkout session params
    const sessionParams = {
      customer: stripeCustomerId,
      mode: config.mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        supabase_user_id: userId,
        app: 'launchpilot',
        tier: config.tier
      }
    }

    // For subscriptions, add subscription metadata
    if (config.mode === 'subscription') {
      sessionParams.subscription_data = {
        metadata: {
          supabase_user_id: userId,
          app: 'launchpilot',
          tier: config.tier
        }
      }
    }

    // For one-time payments, add payment intent metadata
    if (config.mode === 'payment') {
      sessionParams.payment_intent_data = {
        metadata: {
          supabase_user_id: userId,
          app: 'launchpilot',
          tier: config.tier
        }
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams)

    console.log('[stripe-checkout] Session created:', session.id, 'for tier:', config.tier)

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': getCorsOrigin(event),
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify({ url: session.url })
    }
  } catch (error) {
    console.error('[stripe-checkout] Error:', error.message)

    if (error.message === 'Authentication failed' || error.message === 'Missing authorization header') {
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({ error: 'Unauthorized' })
      }
    }

    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
      body: JSON.stringify({ error: 'Failed to create checkout session' })
    }
  }
}
