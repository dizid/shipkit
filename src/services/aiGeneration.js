/**
 * AI Generation Service
 *
 * Unified service for all AI generation operations.
 * Handles template variable substitution, API calls, response parsing, and error handling.
 * Integrated with quota system for free/launcher/pro tier enforcement.
 *
 * NOTE: Usage tracking happens server-side in claude-proxy function (with service role permissions)
 */

import { logger } from '@/utils/logger'
import { getAuthHeaders } from '@/utils/supabase'
import { useAuthStore } from '@/stores/authStore'
import { useProjectStore } from '@/stores/projectStore'
import { withRetry } from '@/utils/retry'

/**
 * Generate AI content based on configuration
 * @param {Object} config - Task configuration with aiConfig and id
 * @param {Object} formData - Form data from user input
 * @param {Object} options - Optional parameters
 * @param {boolean} options.skipQuotaCheck - If true, skip quota validation (admin only)
 * @returns {Promise<string|object>} Generated content (string or parsed object)
 * @throws {Error} If quota exceeded or API call fails
 */
export async function generateAIContent(config, formData, options = {}) {
  if (!config.aiConfig) {
    throw new Error('No aiConfig found in task configuration')
  }

  const { aiConfig } = config

  // Build prompt by replacing placeholders
  let prompt = buildPrompt(aiConfig.promptTemplate, formData, aiConfig.contextProvider)

  // Get user ID for server-side tracking
  const authStore = useAuthStore()
  const userId = authStore.user?.id

  // Call Claude API (usage tracking happens server-side)
  const { responseText } = await callClaudeAPI(
    prompt,
    aiConfig,
    config.id,  // taskId for tracking
    userId       // for tracking
  )

  // Parse response if configured (with error handling)
  let output = responseText
  if (aiConfig.parseResponse) {
    try {
      output = aiConfig.parseResponse(responseText)
    } catch (parseErr) {
      logger.error('[AIGeneration] parseResponse failed', parseErr, {
        taskId: config.id,
        responseLength: responseText.length
      })
      // Fallback to raw text on parse error
      output = responseText
    }
  }

  return output
}

/**
 * Get project context from Pinia store
 * Provides common AI placeholders from the current project settings
 * @returns {Object} Project context with common AI placeholders
 */
function getProjectContext() {
  try {
    const projectStore = useProjectStore()
    const settings = projectStore.currentProjectSettings || {}

    return {
      // Common placeholders used by AI prompts
      app_description: settings.appDescription || settings.description || projectStore.projectDescription || '',
      app_name: settings.appName || settings.name || projectStore.projectName || '',
      target_audience: settings.targetAudience || '',
      primary_goal: settings.primaryGoal || '',
      tech_stack: Array.isArray(settings.techStack) ? settings.techStack.join(', ') : (settings.techStack || ''),
      launch_date: settings.launchDate || ''
    }
  } catch (err) {
    logger.warn('[AIGeneration] Error getting project context from store:', err)
    return {}
  }
}

/**
 * Build prompt by replacing placeholders with form data and context
 * @param {string} template - Prompt template with {placeholder} syntax
 * @param {Object} formData - Form data from user input
 * @param {Function} contextProvider - Optional function to provide additional context
 * @returns {string} Final prompt with placeholders replaced
 */
function buildPrompt(template, formData, contextProvider) {
  let prompt = template

  // Process form data
  const processedFormData = processFormData(formData)

  // Replace placeholders from form data
  for (const [key, value] of Object.entries(processedFormData)) {
    const placeholder = `{${key}}`
    if (prompt.includes(placeholder)) {
      prompt = prompt.replace(new RegExp(placeholder, 'g'), value || '')
    }
  }

  // Inject project context from store
  const projectContext = getProjectContext()
  for (const [key, value] of Object.entries(projectContext)) {
    const placeholder = `{${key}}`
    if (prompt.includes(placeholder) && value) {
      prompt = prompt.replace(new RegExp(placeholder, 'g'), value)
    }
  }

  // Replace placeholders from context provider (can override project context)
  if (contextProvider && typeof contextProvider === 'function') {
    try {
      const context = contextProvider()
      for (const [key, value] of Object.entries(context)) {
        const placeholder = `{${key}}`
        prompt = prompt.replace(new RegExp(placeholder, 'g'), value || '')
      }
    } catch (err) {
      logger.warn('[AIGeneration] Error calling contextProvider')
      // Continue anyway - context provider is optional
    }
  }

  return prompt
}

/**
 * Process form data, applying any necessary transformations
 * @param {Object} formData - Raw form data
 * @returns {Object} Processed form data
 */
function processFormData(formData) {
  const processed = { ...formData }

  // Convert arrays to comma-separated lists if needed
  for (const [key, value] of Object.entries(processed)) {
    if (Array.isArray(value)) {
      processed[`${key}_list`] = value.join(', ')
    }
  }

  return processed
}

/**
 * Call Claude API through Netlify proxy
 * @param {string} prompt - The prompt to send
 * @param {Object} aiConfig - AI configuration (temperature, maxTokens)
 * @param {string} taskId - Task ID for quota tracking
 * @param {string} userId - User ID for quota tracking
 * @returns {Promise<Object>} Object with responseText, tokensInput, and tokensOutput
 * @throws {Error} If API call fails
 */
async function callClaudeAPI(prompt, aiConfig, taskId, userId) {
  // Wrap API call in retry logic
  return withRetry(async () => {
    // Client-side timeout to prevent hanging requests (90 seconds to allow for Netlify's 60s timeout)
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      logger.warn('[AIGeneration] Request timed out after 90 seconds')
      controller.abort()
    }, 90000)

    try {
      logger.debug('[AIGeneration] Calling Claude API with prompt length:', prompt.length)

      const messages = [
        {
          role: 'user',
          content: prompt
        }
      ]

      const authHeaders = await getAuthHeaders()
      const response = await fetch('/.netlify/functions/claude-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders
        },
        body: JSON.stringify({
          messages,
          temperature: aiConfig.temperature || 0.8,
          max_tokens: aiConfig.maxTokens || 1500,
          taskId,      // Send for server-side tracking
          userId       // Send for server-side tracking
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      logger.debug('[AIGeneration] API response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        logger.error('[AIGeneration] API error response', errorData)

        // Provide helpful error messages
        if (response.status === 500 && errorData.error?.includes('API key')) {
          throw new Error('Server configuration error: Claude API key is missing. Please contact the administrator.')
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment and try again.')
        } else if (response.status === 503) {
          throw new Error('Claude API is temporarily unavailable. Please try again later.')
        } else if (response.status === 504) {
          throw new Error('AI generation timed out. Please try again with a shorter prompt.')
        } else {
          throw new Error(errorData.error || `API error: ${response.status}`)
        }
      }

      const data = await response.json()
      logger.debug('[AIGeneration] API response received, parsing...')

      // Claude Messages API returns content as array of content blocks
      const responseText = data.content?.[0]?.text

      if (!responseText) {
        throw new Error('No content received from AI API')
      }

      // Extract token usage information
      const tokensInput = data.usage?.input_tokens || Math.ceil(prompt.length / 3.5)
      const tokensOutput = data.usage?.output_tokens || Math.ceil(responseText.length / 3.5)

      logger.debug('[AIGeneration] Response text obtained, length:', responseText.length)
      logger.debug('[AIGeneration] Token usage', { input: tokensInput, output: tokensOutput })

      return {
        responseText,
        tokensInput,
        tokensOutput
      }
    } catch (err) {
      clearTimeout(timeoutId)

      // Handle abort error with user-friendly message
      if (err.name === 'AbortError') {
        logger.error('[AIGeneration] Request was aborted (timeout)')
        throw new Error('AI generation timed out. Please try again.')
      }

      logger.error('[AIGeneration] AI generation error', err)
      throw err
    }
  }, { maxRetries: 3, baseBackoff: 1000 })
}

/**
 * Validate parsed AI response
 * @param {any} parsed - Parsed response from AI
 * @param {Function} validateFn - Validation function from config
 * @returns {boolean|string} true if valid, error message if invalid
 */
export function validateParsedResponse(parsed, validateFn) {
  if (!validateFn || typeof validateFn !== 'function') {
    return true
  }

  try {
    const result = validateFn(parsed)
    return result === true ? true : (result || 'Validation failed')
  } catch (err) {
    return `Validation error: ${err.message}`
  }
}
