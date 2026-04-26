/**
 * Subscription Store (Pinia)
 *
 * Manages subscription tier, AI usage quota, and Stripe checkout/portal sessions.
 * All queries filter by app='launchpilot' for shared Supabase instance.
 *
 * Usage:
 * import { useSubscriptionStore } from '@/stores/subscriptionStore'
 * const sub = useSubscriptionStore()
 * sub.tier          // 'free' | 'launcher' | 'pro'
 * sub.canAccessTask('launcher') // true/false
 * sub.canGenerateAI // true/false
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, getAuthHeaders } from '@/utils/supabase'
import { useAuthStore } from '@/stores/authStore'

const TIER_ORDER = { free: 0, launcher: 1, pro: 2 }
const TIER_LIMITS = { free: 40, launcher: 400, pro: 400 }

export const useSubscriptionStore = defineStore('subscription', () => {
  // State
  const subscription = ref(null)
  const aiUsageCount = ref(0)
  const isLoading = ref(false)
  const error = ref(null)

  // Computed
  const tier = computed(() => subscription.value?.tier || 'free')
  const isFree = computed(() => tier.value === 'free')
  const isLauncher = computed(() => tier.value === 'launcher')
  const isPro = computed(() => tier.value === 'pro')
  const isActive = computed(() => {
    if (!subscription.value) return false
    return ['active'].includes(subscription.value.status)
  })

  const aiQuotaLimit = computed(() => TIER_LIMITS[tier.value] || 40)
  const aiQuotaUsed = computed(() => aiUsageCount.value)
  const aiQuotaPercent = computed(() => {
    if (aiQuotaLimit.value === 0) return 100
    return Math.round((aiQuotaUsed.value / aiQuotaLimit.value) * 100)
  })
  const canGenerateAI = computed(() => aiQuotaUsed.value < aiQuotaLimit.value)

  /**
   * Check if user can access a task based on its tier requirement
   * @param {string} taskTier - 'free' | 'launcher' | 'pro'
   */
  function canAccessTask(taskTier) {
    const userLevel = TIER_ORDER[tier.value] ?? 0
    const requiredLevel = TIER_ORDER[taskTier] ?? 0
    return userLevel >= requiredLevel
  }

  /**
   * Fetch subscription from Supabase
   */
  async function fetchSubscription() {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      subscription.value = null
      return
    }

    try {
      isLoading.value = true
      error.value = null

      const { data, error: fetchError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', authStore.user.id)
        .eq('app', 'launchpilot')
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 = no rows found (user is free tier)
        console.error('[subscriptionStore] Fetch error:', fetchError.message)
        error.value = fetchError.message
      }

      subscription.value = data || null
    } catch (err) {
      console.error('[subscriptionStore] Exception:', err.message)
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch AI usage count for current month
   */
  async function fetchAIUsage() {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      aiUsageCount.value = 0
      return
    }

    try {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { count, error: countError } = await supabase
        .from('ai_usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', authStore.user.id)
        .eq('app', 'launchpilot')
        .gte('created_at', startOfMonth.toISOString())

      if (countError) {
        console.error('[subscriptionStore] AI usage count error:', countError.message)
        return
      }

      aiUsageCount.value = count || 0
    } catch (err) {
      console.error('[subscriptionStore] AI usage exception:', err.message)
    }
  }

  /**
   * Create a Stripe Checkout Session and redirect
   * @param {string} priceId - Stripe price ID
   */
  async function createCheckoutSession(priceId) {
    try {
      isLoading.value = true
      error.value = null

      const headers = await getAuthHeaders()
      const response = await fetch('/.netlify/functions/stripe-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({ priceId })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (err) {
      console.error('[subscriptionStore] Checkout error:', err.message)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Create a Stripe Billing Portal session and redirect
   */
  async function createPortalSession() {
    try {
      isLoading.value = true
      error.value = null

      const headers = await getAuthHeaders()
      const response = await fetch('/.netlify/functions/stripe-portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create portal session')
      }

      // Redirect to Stripe Billing Portal
      window.location.href = data.url
    } catch (err) {
      console.error('[subscriptionStore] Portal error:', err.message)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Initialize — fetch subscription + usage together
   */
  async function initialize() {
    await Promise.all([fetchSubscription(), fetchAIUsage()])
  }

  /**
   * Clear state (on sign out)
   */
  function reset() {
    subscription.value = null
    aiUsageCount.value = 0
    isLoading.value = false
    error.value = null
  }

  return {
    // State
    subscription,
    aiUsageCount,
    isLoading,
    error,

    // Computed
    tier,
    isFree,
    isLauncher,
    isPro,
    isActive,
    aiQuotaLimit,
    aiQuotaUsed,
    aiQuotaPercent,
    canGenerateAI,

    // Methods
    canAccessTask,
    fetchSubscription,
    fetchAIUsage,
    createCheckoutSession,
    createPortalSession,
    initialize,
    reset
  }
})
