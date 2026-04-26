<script setup>
/**
 * QuotaExceededModal — shown when user hits AI generation limit
 * Offers upgrade path based on current tier
 */
import { computed } from 'vue'
import { useSubscriptionStore } from '@/stores/subscriptionStore'

const emit = defineEmits(['close'])
const subscriptionStore = useSubscriptionStore()

const upgradeConfig = computed(() => {
  if (subscriptionStore.isFree) {
    return {
      message: 'You\'ve used all 40 free AI generations this month.',
      ctaText: 'Upgrade to Launcher — $29',
      priceId: import.meta.env.VITE_STRIPE_LAUNCHER_PRICE_ID
    }
  }
  // Launcher/Pro users hitting quota (400/mo)
  return {
    message: `You've used all ${subscriptionStore.aiQuotaLimit} AI generations this month.`,
    ctaText: 'Quota resets next month',
    priceId: null
  }
})

async function handleUpgrade() {
  if (upgradeConfig.value.priceId) {
    await subscriptionStore.createCheckoutSession(upgradeConfig.value.priceId)
  } else {
    emit('close')
  }
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal-content">
      <button class="modal-close" @click="emit('close')">&times;</button>

      <div class="modal-icon">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ffbe0b" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>

      <h3 class="modal-title">AI Quota Exceeded</h3>
      <p class="modal-message">{{ upgradeConfig.message }}</p>

      <div class="modal-usage">
        <span class="usage-count">{{ subscriptionStore.aiQuotaUsed }}</span>
        <span class="usage-separator">/</span>
        <span class="usage-limit">{{ subscriptionStore.aiQuotaLimit }}</span>
        <span class="usage-label">used this month</span>
      </div>

      <button
        class="modal-cta"
        :disabled="subscriptionStore.isLoading"
        @click="handleUpgrade"
      >
        {{ subscriptionStore.isLoading ? 'Loading...' : upgradeConfig.ctaText }}
      </button>

      <button class="modal-dismiss" @click="emit('close')">
        Maybe later
      </button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-content {
  background: #111;
  border: 1px solid #ffbe0b;
  padding: 32px;
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  position: relative;
  text-align: center;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 16px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
}

.modal-close:hover {
  color: #fff;
}

.modal-icon {
  opacity: 0.9;
}

.modal-title {
  font-family: 'Unbounded', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffbe0b;
  margin: 0;
}

.modal-message {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.5;
}

.modal-usage {
  display: flex;
  align-items: baseline;
  gap: 4px;
  font-family: 'JetBrains Mono', monospace;
}

.usage-count {
  font-size: 1.5rem;
  font-weight: 700;
  color: #c9004f;
}

.usage-separator {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.4);
}

.usage-limit {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
}

.usage-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  margin-left: 8px;
}

.modal-cta {
  width: 100%;
  padding: 12px 24px;
  background: #00d9ff;
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

.modal-cta:hover {
  opacity: 0.9;
}

.modal-cta:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-dismiss {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.75rem;
  cursor: pointer;
  padding: 4px 8px;
}

.modal-dismiss:hover {
  color: rgba(255, 255, 255, 0.7);
}
</style>
