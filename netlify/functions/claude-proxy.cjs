// netlify/functions/claude-proxy.cjs
// Netlify serverless function to proxy requests to Anthropic Claude API
// Handles authentication, quota enforcement, and usage tracking to Supabase

const { createClient } = require('@supabase/supabase-js')
const { verifyAuth, getCorsOrigin } = require('./utils/auth.cjs')

// Initialize Supabase client with service role for quota tracking
// Note: These may be undefined - we check in trackAIUsage before using
let supabase = null
try {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.VITE_SUPABASE_URL) {
    supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  }
} catch (err) {
  console.warn('[claude-proxy] Failed to initialize Supabase:', err.message)
  supabase = null
}

/**
 * Track AI usage in Supabase (server-side with service role)
 */
async function trackAIUsage(userId, taskId, model, tokensInput, tokensOutput) {
  try {
    console.log('[claude-proxy] Tracking usage for task, tokens:', tokensOutput)

    if (!supabase) {
      console.warn('[claude-proxy] Supabase not configured - skipping usage tracking')
      console.warn('[claude-proxy] Required env vars: SUPABASE_SERVICE_ROLE_KEY, VITE_SUPABASE_URL')
      return false
    }

    const { error } = await supabase
      .from('ai_usage')
      .insert([{
        user_id: userId,
        task_id: taskId,
        model: model,
        tokens_input: tokensInput,
        tokens_output: tokensOutput,
        cost_estimate: 0 // Calculated server-side if needed
      }])

    if (error) {
      console.error('[claude-proxy] Failed to track usage:', error.message)
      // Don't throw - usage tracking should not fail the generation
      return false
    }

    console.log('[claude-proxy] Usage tracked successfully')
    return true
  } catch (err) {
    console.error('[claude-proxy] Exception in trackAIUsage:', err.message)
    return false
  }
}

exports.handler = async (event) => {
  console.log('[claude-proxy] Function invoked at:', new Date().toISOString())
  console.log('[claude-proxy] HTTP Method:', event.httpMethod)

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': getCorsOrigin(event),
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: ''
    }
  }

  if (event.httpMethod !== 'POST') {
    console.error('[claude-proxy] Invalid HTTP method:', event.httpMethod)
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    }
  }

  try {
    // Verify authentication
    let verifiedUserId
    try {
      const auth = await verifyAuth(event)
      verifiedUserId = auth.userId
      console.log('[claude-proxy] Request authenticated')
    } catch (authError) {
      console.error('[claude-proxy] Auth failed:', authError.message)
      return {
        statusCode: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({ error: 'Unauthorized', details: authError.message })
      }
    }

    // Parse request body
    if (!event.body) {
      console.error('[claude-proxy] Request body is empty or undefined')
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({ error: 'Request body is empty' })
      }
    }

    let requestBody
    try {
      requestBody = JSON.parse(event.body)
    } catch (parseError) {
      console.error('[claude-proxy] Failed to parse request body')
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({ error: 'Invalid request body format' })
      }
    }

    // Extract fields — use verified userId instead of client-supplied
    let { messages, temperature, max_tokens, taskId } = requestBody
    const userId = verifiedUserId

    // Validate messages array
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({ error: 'Missing or invalid required field: messages' })
      }
    }

    // Clamp temperature and max_tokens to safe ranges
    temperature = Math.max(0, Math.min(1, temperature || 0.7))
    max_tokens = Math.max(1, Math.min(4096, max_tokens || 1500))

    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('[claude-proxy] ANTHROPIC_API_KEY environment variable is missing')
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({ error: 'Server configuration error: Missing API key' })
      }
    }

    // Check quota before calling Claude API
    if (userId && supabase) {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { count, error: countError } = await supabase
        .from('ai_usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', startOfMonth.toISOString())

      if (!countError) {
        // Get user's tier from subscriptions table
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('tier')
          .eq('user_id', userId)
          .single()

        const tier = subData?.tier || 'free'
        const TIER_LIMITS = { free: 40, launcher: 400, pro: 400 }
        const limit = TIER_LIMITS[tier] || 40

        if (count >= limit) {
          return {
            statusCode: 429,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
            body: JSON.stringify({
              error: 'Monthly AI generation quota exceeded',
              quota: { used: count, limit, tier, resetDate: startOfMonth.toISOString() }
            })
          }
        }
      }
    }

    const model = 'claude-sonnet-4-6'
    console.log('[claude-proxy] Forwarding request to Claude API with model:', model)
    console.log('[claude-proxy] Request has', messages.length, 'message(s)')

    // Forward request to Anthropic Claude API with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      console.error('[claude-proxy] Aborting request due to timeout')
      controller.abort()
    }, 60000) // 60 second timeout

    let claudeResponse
    try {
      console.log('[claude-proxy] Making fetch request to Claude API...')
      const startTime = Date.now()

      claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens
        }),
        signal: controller.signal
      })

      const elapsed = Date.now() - startTime
      console.log('[claude-proxy] Claude API responded in', elapsed, 'ms with status:', claudeResponse.status)
      clearTimeout(timeoutId)
    } catch (fetchError) {
      clearTimeout(timeoutId)
      if (fetchError.name === 'AbortError') {
        console.error('[claude-proxy] Claude API request timed out')
        return {
          statusCode: 504,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
          body: JSON.stringify({ error: 'Claude API request timed out' })
        }
      }
      console.error('[claude-proxy] Failed to connect to Claude API:', fetchError.message)
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({ error: 'Failed to connect to Claude API' })
      }
    }

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text()
      console.error('[claude-proxy] Claude API error:', claudeResponse.status, errorText)
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({
          error: `Claude API error: ${claudeResponse.status}`
        })
      }
    }

    // Parse and validate response
    let responseData
    try {
      responseData = await claudeResponse.json()
    } catch (parseError) {
      console.error('[claude-proxy] Failed to parse Claude API response')
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({ error: 'Invalid response format from Claude API' })
      }
    }

    // Validate Claude Messages API response structure
    // Claude returns: { id, type, role, content: [{ type: 'text', text: '...' }], ... }
    if (!responseData.content || !Array.isArray(responseData.content) || responseData.content.length === 0) {
      console.error('[claude-proxy] Invalid Claude API response structure')
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({ error: 'Invalid response structure from Claude API' })
      }
    }

    const textBlock = responseData.content.find(block => block.type === 'text')
    if (!textBlock || !textBlock.text) {
      console.error('[claude-proxy] Missing text content in response')
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
        body: JSON.stringify({ error: 'No text content in Claude API response' })
      }
    }

    console.log('[claude-proxy] Successfully received response from Claude API')

    // Track usage if userId and taskId provided
    if (userId && taskId) {
      const tokensInput = responseData.usage?.input_tokens ||
        messages.reduce((sum, msg) => sum + (msg.content?.length || 0) / 4, 0)
      const tokensOutput = responseData.usage?.output_tokens || textBlock.text.length / 4

      await trackAIUsage(userId, taskId, model, Math.ceil(tokensInput), Math.ceil(tokensOutput))
    }

    // Return the Claude response (content array format)
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': getCorsOrigin(event),
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      },
      body: JSON.stringify(responseData)
    }
  } catch (error) {
    console.error('[claude-proxy] Unexpected error:', error.message)
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsOrigin(event) },
      body: JSON.stringify({ error: 'Failed to process request' })
    }
  }
}
