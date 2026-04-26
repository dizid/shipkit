<script setup>
/**
 * UpgradePrompt — shown inline when a user tries to access a locked task
 * Displays tier-specific messaging and CTA to upgrade
 */
import { computed } from 'vue'
import { useSubscriptionStore } from '@/stores/subscriptionStore'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const props = defineProps({
  requiredTier: {
    type: String,
    required: true,
    validator: (v) => ['launcher', 'pro'].includes(v)
  }
})

const subscriptionStore = useSubscriptionStore()
const authStore = useAuthStore()
const router = useRouter()

const tierConfig = computed(() => {
  if (props.requiredTier === 'launcher') {
    return {
      name: 'Launcher',
      price: '$29',
      priceLabel: 'one-time',
      color: '#00d9ff',
      priceId: import.meta.env.VITE_STRIPE_LAUNCHER_PRICE_ID,
      features: [
        'All 32 launch tasks',
        'Templates & frameworks',
        'Unlimited AI generations'
      ]
    }
  }
  return {
    name: 'Pro',
    price: '$9',
    priceLabel: '/month',
    color: '#c9004f',
    priceId: import.meta.env.VITE_STRIPE_PRO_PRICE_ID,
    features: [
      'Everything in Launcher',
      'Monthly new strategies',
      'Priority support'
    ]
  }
})

async function handleUpgrade() {
  if (!authStore.isAuthenticated) {
    router.push('/auth')
    return
  }
  await subscriptionStore.createCheckoutSession(tierConfig.value.priceId)
}
</script>

<template>
  <div class="upgrade-prompt" :style="{ '--tier-color': tierConfig.color }">
    <div class="upgrade-icon">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    </div>

    <h3 class="upgrade-title">Unlock with {{ tierConfig.name }}</h3>

    <p class="upgrade-price">
      <span class="price-amount">{{ tierConfig.price }}</span>
      <span class="price-label">{{ tierConfig.priceLabel }}</span>
    </p>

    <ul class="upgrade-features">
      <li v-for="feature in tierConfig.features" :key="feature">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        {{ feature }}
      </li>
    </ul>

    <button
      class="upgrade-cta"
      :disabled="subscriptionStore.isLoading"
      @click="handleUpgrade"
    >
      {{ subscriptionStore.isLoading ? 'Loading...' : `Upgrade to ${tierConfig.name}` }}
    </button>
  </div>
</template>

<style scoped>
.upgrade-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 24px;
  border: 1px solid var(--tier-color, #00d9ff);
  background: rgba(0, 0, 0, 0.4);
  text-align: center;
}

.upgrade-icon {
  color: var(--tier-color);
  opacity: 0.8;
}

.upgrade-title {
  font-family: 'Unbounded', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--tier-color);
  margin: 0;
}

.upgrade-price {
  margin: 0;
}

.price-amount {
  font-family: 'Unbounded', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
}

.price-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin-left: 4px;
}

.upgrade-features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.upgrade-features li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
}

.upgrade-features li svg {
  color: var(--tier-color);
  flex-shrink: 0;
}

.upgrade-cta {
  margin-top: 8px;
  padding: 12px 32px;
  background: var(--tier-color);
  color: #000;
  border: none;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: opacity 0.2s;
}

.upgrade-cta:hover {
  opacity: 0.9;
}

.upgrade-cta:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
