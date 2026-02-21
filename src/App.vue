<template>
  <!-- Root Application Component -->
  <div id="app">
    <ErrorBoundary>
      <router-view />
    </ErrorBoundary>
  </div>
</template>

<script setup>
/**
 * App.vue - Root Component
 *
 * Responsibilities:
 * - Initialize authentication state on app load
 * - Subscribe to auth state changes
 * - Render router views
 */

import { onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import ErrorBoundary from '@/components/shared/ErrorBoundary.vue'
import '@/assets/main.css'

const authStore = useAuthStore()
let unsubscribe = null

onMounted(async () => {
  // Initialize authentication and check for existing session
  await authStore.initializeAuth()

  // Handle email confirmation/recovery redirects
  const hash = window.location.hash
  if (hash && (hash.includes('type=recovery') || hash.includes('type=signup'))) {
    // Auth state will be handled by the auth store subscription
  }

  // Subscribe to future auth state changes
  unsubscribe = authStore.subscribeToAuthChanges()
})

onBeforeUnmount(() => {
  if (unsubscribe && typeof unsubscribe === 'function') {
    unsubscribe()
  }
})
</script>

<style>
#app {
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;
}
</style>
