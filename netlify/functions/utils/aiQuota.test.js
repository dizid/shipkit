// @vitest-environment node
// T-0651: claude-proxy's quota check (per-user monthly limit, daily ceiling
// for all users, fails closed).
import { describe, it, expect, vi } from 'vitest'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { checkAiQuota, TIER_LIMITS, GLOBAL_DAILY_AI_CAP } = require('./aiQuota.cjs')

/**
 * Fake Supabase client: answers the two ai_usage counts and the tier lookup.
 * `userCount`/`todayCount` are numbers, or an Error to simulate a failed query.
 */
function fakeSupabase({ userCount = 0, todayCount = 0, tier = null, calls = [] } = {}) {
  return {
    from(table) {
      const filters = {}
      const query = {
        select() { return query },
        eq(col, val) { filters[col] = val; return query },
        gte(col, val) {
          filters[col] = val
          calls.push({ table, ...filters })
          // with user_id = this user's month count, without = everyone's today
          const value = 'user_id' in filters ? userCount : todayCount
          return Promise.resolve(value instanceof Error ? { count: null, error: value } : { count: value, error: null })
        },
        maybeSingle() {
          return Promise.resolve({ data: tier ? { tier } : null, error: null })
        },
      }
      return query
    },
  }
}

const now = new Date('2026-11-27T15:00:00Z')

describe('checkAiQuota', () => {
  it('allows a free user under both limits, and counts from the start of the UTC month and day', async () => {
    const calls = []
    expect(await checkAiQuota(fakeSupabase({ userCount: 3, todayCount: 10, calls }), 'u1', now)).toEqual({ allowed: true })
    expect(calls).toContainEqual(expect.objectContaining({ user_id: 'u1', app: 'launchpilot', created_at: '2026-11-01T00:00:00.000Z' }))
    expect(calls).toContainEqual({ table: 'ai_usage', app: 'launchpilot', created_at: '2026-11-27T00:00:00.000Z' })
  })

  it('refuses a free user at the monthly limit with the quota details', async () => {
    const result = await checkAiQuota(fakeSupabase({ userCount: TIER_LIMITS.free }), 'u1', now)
    expect(result.allowed).toBe(false)
    expect(result.status).toBe(429)
    expect(result.body.quota).toMatchObject({ used: TIER_LIMITS.free, limit: TIER_LIMITS.free, tier: 'free' })
  })

  it('gives a paid tier its higher limit', async () => {
    expect(await checkAiQuota(fakeSupabase({ userCount: 100, tier: 'pro' }), 'u1', now)).toEqual({ allowed: true })
  })

  it('refuses everyone once the daily ceiling for all users is reached', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const result = await checkAiQuota(fakeSupabase({ userCount: 0, todayCount: GLOBAL_DAILY_AI_CAP, tier: 'pro' }), 'u1', now)
    expect(result).toMatchObject({ allowed: false, status: 429 })
  })

  it('fails closed when a count fails, the client throws, or there is no client', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(await checkAiQuota(fakeSupabase({ userCount: new Error('db down') }), 'u1', now)).toMatchObject({ allowed: false, status: 503 })
    expect(await checkAiQuota(fakeSupabase({ todayCount: new Error('db down') }), 'u1', now)).toMatchObject({ allowed: false, status: 503 })
    const throwing = { from() { throw new Error('boom') } }
    expect(await checkAiQuota(throwing, 'u1', now)).toMatchObject({ allowed: false, status: 503 })
    expect(await checkAiQuota(null, 'u1', now)).toMatchObject({ allowed: false, status: 503 })
  })
})
