<script setup>
/**
 * QuotaDisplay — progress bar showing AI generation usage
 * Color shifts: cyan (<80%), yellow (80-95%), magenta (>95%)
 */
import { computed } from 'vue'
import { useSubscriptionStore } from '@/stores/subscriptionStore'

const subscriptionStore = useSubscriptionStore()

const barColor = computed(() => {
  const pct = subscriptionStore.aiQuotaPercent
  if (pct > 95) return '#c9004f'
  if (pct > 80) return '#ffbe0b'
  return '#00d9ff'
})

const barWidth = computed(() => {
  return Math.min(100, subscriptionStore.aiQuotaPercent) + '%'
})
</script>

<template>
  <div class="quota-display">
    <div class="quota-header">
      <span class="quota-label">AI Generations</span>
      <span class="quota-count">
        {{ subscriptionStore.aiQuotaUsed }} / {{ subscriptionStore.aiQuotaLimit }}
      </span>
    </div>
    <div class="quota-bar-bg">
      <div
        class="quota-bar-fill"
        :style="{ width: barWidth, backgroundColor: barColor }"
      />
    </div>
    <p v-if="subscriptionStore.aiQuotaPercent > 80" class="quota-warning">
      {{ subscriptionStore.aiQuotaPercent >= 100
        ? 'Quota reached — upgrade for more generations'
        : 'Running low on AI generations this month'
      }}
    </p>
  </div>
</template>

<style scoped>
.quota-display {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.quota-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quota-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.quota-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
}

.quota-bar-bg {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.quota-bar-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.quota-warning {
  font-size: 0.75rem;
  color: #ffbe0b;
  margin: 0;
}
</style>
