// AI quota check for claude-proxy (T-0651).
// Sign-up is free, so the per-user monthly limit alone doesn't bound Marc's
// Anthropic bill: there is also a ceiling for all users together per UTC day.
// Fails CLOSED: if usage can't be counted, no AI call is made (before, a
// failed count or a missing Supabase client let every request through).
// Counts come from the existing ai_usage rows (one per answered call, written
// by claude-proxy's trackAIUsage), so no new table.

const TIER_LIMITS = { free: 40, launcher: 400, pro: 400 }

// All LaunchPilot users together per UTC day. Haiku 4.5 with input capped at
// 100k chars and output at 4,096 tokens is ~$0.045 per call at most, so 100
// calls is ~$4.50 a day in the worst case (a normal call is ~$0.01).
const GLOBAL_DAILY_AI_CAP = 100

/**
 * Decide whether this user may make one more AI call now.
 * @param {object|null} supabase - service-role Supabase client
 * @param {string} userId - verified user id
 * @param {Date} [now]
 * @returns {Promise<{allowed: true} | {allowed: false, status: number, body: object}>}
 */
async function checkAiQuota(supabase, userId, now = new Date()) {
  if (!supabase) {
    console.error('[aiQuota] Supabase not configured: refusing AI call (fail closed)')
    return { allowed: false, status: 503, body: { error: 'AI generation is unavailable right now. Please try again later.' } }
  }

  const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const startOfDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))

  try {
    const [userMonth, allToday, subscription] = await Promise.all([
      supabase
        .from('ai_usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('app', 'launchpilot')
        .gte('created_at', startOfMonth.toISOString()),
      supabase
        .from('ai_usage')
        .select('*', { count: 'exact', head: true })
        .eq('app', 'launchpilot')
        .gte('created_at', startOfDay.toISOString()),
      // maybeSingle: no subscription row = free tier, not an error
      supabase
        .from('subscriptions')
        .select('tier')
        .eq('user_id', userId)
        .eq('app', 'launchpilot')
        .maybeSingle(),
    ])

    if (userMonth.error || allToday.error || typeof userMonth.count !== 'number' || typeof allToday.count !== 'number') {
      console.error('[aiQuota] Usage count failed: refusing AI call (fail closed)', userMonth.error?.message || allToday.error?.message || '')
      return { allowed: false, status: 503, body: { error: 'AI generation is unavailable right now. Please try again later.' } }
    }

    if (allToday.count >= GLOBAL_DAILY_AI_CAP) {
      console.error('[aiQuota] Global daily AI cap reached:', allToday.count)
      return { allowed: false, status: 429, body: { error: 'AI generation is busy for today. Please try again tomorrow.' } }
    }

    // A failed subscription lookup counts as the free tier (the lowest limit).
    const tier = subscription.data?.tier || 'free'
    const limit = TIER_LIMITS[tier] || TIER_LIMITS.free
    if (userMonth.count >= limit) {
      return {
        allowed: false,
        status: 429,
        body: {
          error: 'Monthly AI generation quota exceeded',
          quota: { used: userMonth.count, limit, tier, resetDate: startOfMonth.toISOString() },
        },
      }
    }

    return { allowed: true }
  } catch (err) {
    console.error('[aiQuota] Quota check threw: refusing AI call (fail closed)', err.message)
    return { allowed: false, status: 503, body: { error: 'AI generation is unavailable right now. Please try again later.' } }
  }
}

module.exports = { checkAiQuota, TIER_LIMITS, GLOBAL_DAILY_AI_CAP }
