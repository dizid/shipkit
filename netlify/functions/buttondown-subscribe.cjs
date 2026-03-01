// netlify/functions/buttondown-subscribe.cjs
// Public endpoint to subscribe emails via Buttondown API + Supabase waitlist (dual-write)
// No auth required — landing page visitors aren't logged in

const { createClient } = require('@supabase/supabase-js')
const { getCorsOrigin } = require('./utils/auth.cjs')

// Initialize Supabase with service role for server-side insert
let supabase = null
try {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.VITE_SUPABASE_URL) {
    supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  }
} catch (err) {
  console.warn('[buttondown] Failed to init Supabase:', err.message)
}

exports.handler = async (event) => {
  const corsOrigin = getCorsOrigin(event)
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }

  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) }
  }

  // Parse body
  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) }
  }

  const { email, source, utm_data } = body

  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Valid email required' }) }
  }

  // 1. Subscribe to Buttondown
  let buttondownOk = false
  try {
    if (!process.env.BUTTONDOWN_API_KEY) {
      console.warn('[buttondown] BUTTONDOWN_API_KEY not set — skipping Buttondown')
    } else {
      const resp = await fetch('https://api.buttondown.com/v1/subscribers', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${process.env.BUTTONDOWN_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email_address: email,
          type: 'regular',
          metadata: { source: source || 'unknown', ...(utm_data || {}) },
          tags: [source || 'landing-page']
        })
      })

      if (resp.ok || resp.status === 201) {
        buttondownOk = true
      } else if (resp.status === 409) {
        // Already subscribed — treat as success
        buttondownOk = true
      } else {
        const errText = await resp.text()
        console.error('[buttondown] API error:', resp.status, errText)
      }
    }
  } catch (err) {
    console.error('[buttondown] Fetch failed:', err.message)
  }

  // 2. Save to Supabase waitlist (backup + analytics)
  let supabaseOk = false
  if (supabase) {
    try {
      const utm = utm_data || {}
      const { error } = await supabase
        .from('waitlist')
        .insert({
          email,
          source: source || 'unknown',
          utm_source: utm.source || null,
          utm_medium: utm.medium || null,
          utm_campaign: utm.campaign || null
        })

      if (error) {
        // 23505 = unique_violation — already on waitlist, that's fine
        if (error.code === '23505') {
          supabaseOk = true
        } else {
          console.error('[buttondown] Supabase insert error:', error.message)
        }
      } else {
        supabaseOk = true
      }
    } catch (err) {
      console.error('[buttondown] Supabase exception:', err.message)
    }
  }

  // At least one write must succeed
  if (!buttondownOk && !supabaseOk) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to subscribe. Please try again.' })
    }
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true, buttondown: buttondownOk, supabase: supabaseOk })
  }
}
