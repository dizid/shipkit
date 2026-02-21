/**
 * LaunchPilot - Application Entry Point
 *
 * Sets up:
 * - Vue 3 instance
 * - Pinia state management
 * - Vue Router
 * - @unhead/vue for SEO meta management
 * - Sentry error tracking (production only)
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as Sentry from '@sentry/vue'
import App from './App.vue'
import { createHead } from '@unhead/vue/client'
import router from './router/index.js'

// Create Vue app instance
const app = createApp(App)

// Global Vue error handler
app.config.errorHandler = (err, _instance, info) => {
  console.error('[Vue Error]', err, { componentInfo: info })
}

// Initialize Sentry (production only)
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    app,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration({ router }),
      Sentry.replayIntegration()
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: 'production'
  })
}

// Plugins
app.use(createPinia())
app.use(router)
app.use(createHead())

// Global error handlers
window.addEventListener('error', (event) => {
  console.error('[Global Error]', event.error || new Error(event.message))
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Rejection]', event.reason)
})

app.mount('#app')
