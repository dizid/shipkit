// netlify/functions/stripe-portal.cjs
// Creates a Stripe Customer Portal session for managing subscriptions

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
  console.warn('[stripe-portal] Failed to initialize Supabase:', err.message)
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
    const { userId } = await verifyAuth(event)

    // Look up Stripe customer ID from subscriptions
    if (!supabase) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({ error: 'Database not configured' })
      }
    }

    const { data: subData } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .eq('app', 'launchpilot')
      .single()

    if (!subData?.stripe_customer_id) {
      return {
        statusCode: 404,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({ error: 'No billing account found' })
      }
    }

    // Create portal session
    const origin = event.headers?.origin || 'https://launchpilot.marketing'
    const session = await stripe.billingPortal.sessions.create({
      customer: subData.stripe_customer_id,
      return_url: `${origin}/dashboard/settings`
    })

    console.log('[stripe-portal] Portal session created for user:', userId)

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
    console.error('[stripe-portal] Error:', error.message)

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
      body: JSON.stringify({ error: 'Failed to create portal session' })
    }
  }
}
