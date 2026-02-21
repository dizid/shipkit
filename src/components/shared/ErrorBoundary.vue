<template>
  <!-- Normal content slot -->
  <slot v-if="!hasError" />

  <!-- Error fallback UI — cyberpunk style -->
  <div v-else class="min-h-screen flex items-center justify-center p-4" style="background: var(--cyberpunk-dark);">
    <div
      class="max-w-md w-full p-8"
      style="background: var(--cyberpunk-surface); border: 1px solid var(--cyberpunk-accent);"
    >
      <div class="text-center">
        <!-- Error Icon -->
        <div
          class="mx-auto flex items-center justify-center mb-6"
          style="width: 4rem; height: 4rem; background: rgba(201, 0, 79, 0.15); border: 1px solid var(--cyberpunk-accent);"
        >
          <svg style="width: 2rem; height: 2rem; color: var(--cyberpunk-accent-light);" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <!-- Error Message -->
        <h2 class="text-xl font-bold mb-2" style="font-family: var(--font-display); color: var(--cyberpunk-text);">
          Something went wrong
        </h2>
        <p class="mb-6" style="color: var(--cyberpunk-text-secondary); font-size: 0.9rem;">
          We encountered an unexpected error. Your data is safe.
        </p>

        <!-- Error Details (dev mode only) -->
        <div
          v-if="isDev && errorMessage"
          class="mb-6 p-4 text-left"
          style="background: var(--cyberpunk-dark); border: 1px solid var(--cyberpunk-border);"
        >
          <p style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--cyberpunk-accent-light); word-break: break-all;">
            {{ errorMessage }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex flex-col gap-3">
          <button @click="handleRetry" class="btn-primary w-full">
            Try Again
          </button>
          <button @click="goHome" class="btn-ghost w-full">
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'
import { useRouter } from 'vue-router'

const hasError = ref(false)
const errorMessage = ref('')
const isDev = import.meta.env.DEV
const router = useRouter()

/**
 * Capture errors from child components
 * Returns false to prevent error propagation to parent
 */
onErrorCaptured((err, instance, info) => {
  hasError.value = true
  errorMessage.value = err.message || String(err)

  console.error('[ErrorBoundary] Caught error:', {
    error: err,
    component: instance?.$options?.name || 'Unknown',
    errorInfo: info,
    stack: err.stack
  })

  return false
})

const handleRetry = () => {
  hasError.value = false
  errorMessage.value = ''
}

const goHome = () => {
  hasError.value = false
  errorMessage.value = ''
  router.push('/dashboard')
}
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}
</style>
