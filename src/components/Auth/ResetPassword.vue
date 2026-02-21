<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background: var(--cyberpunk-dark);">
    <div class="w-full max-w-md" style="border: 1px solid var(--cyberpunk-border); background: var(--cyberpunk-surface); padding: 2.5rem;">

      <!-- Header -->
      <div class="mb-8">
        <div class="mb-4">
          <span class="badge badge-primary text-xs">SHIPKIT</span>
        </div>
        <h1 class="text-2xl font-bold mb-2" style="font-family: var(--font-display); color: var(--cyberpunk-text);">
          Reset Password
        </h1>
        <p style="color: var(--cyberpunk-text-secondary); font-size: 0.9rem;">
          Enter your new password below
        </p>
      </div>

      <!-- Error Alert -->
      <div
        v-if="error"
        class="mb-4 p-3"
        style="background: rgba(201, 0, 79, 0.1); border: 1px solid var(--cyberpunk-accent); color: var(--cyberpunk-accent-light); font-size: 0.875rem;"
      >
        {{ error }}
      </div>

      <!-- Success Message -->
      <div
        v-if="message"
        class="mb-4 p-3"
        style="background: rgba(0, 255, 136, 0.1); border: 1px solid #00ff88; color: #00ff88; font-size: 0.875rem;"
      >
        {{ message }}
      </div>

      <!-- Reset Form -->
      <form v-if="!resetSuccess" @submit.prevent="handleReset" class="space-y-4">
        <div>
          <label
            for="password"
            class="block text-xs font-semibold mb-2"
            style="color: var(--cyberpunk-text-secondary); letter-spacing: 0.5px; text-transform: uppercase; font-family: var(--font-mono);"
          >
            New Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="At least 6 characters"
            required
            :disabled="isLoading"
          />
        </div>

        <div>
          <label
            for="confirmPassword"
            class="block text-xs font-semibold mb-2"
            style="color: var(--cyberpunk-text-secondary); letter-spacing: 0.5px; text-transform: uppercase; font-family: var(--font-mono);"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            required
            :disabled="isLoading"
          />
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="btn-primary w-full mt-6"
        >
          {{ isLoading ? 'Resetting...' : 'Reset Password' }}
        </button>
      </form>

      <!-- Success State -->
      <div v-else class="text-center">
        <p
          class="text-lg font-semibold mb-3"
          style="color: #00ff88; font-family: var(--font-display);"
        >
          Password Reset Successfully
        </p>
        <p class="mb-6" style="color: var(--cyberpunk-text-secondary); font-size: 0.9rem;">
          You can now sign in with your new password.
        </p>
        <router-link to="/auth" class="btn-primary inline-block">
          Back to Sign In
        </router-link>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/utils/supabase.js'

const router = useRouter()
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const message = ref('')
const isLoading = ref(false)
const resetSuccess = ref(false)

let redirectTimeout = null

const handleReset = async () => {
  error.value = ''

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  isLoading.value = true

  try {
    const { error: resetError } = await supabase.auth.updateUser({
      password: password.value
    })

    if (resetError) throw resetError

    resetSuccess.value = true
    message.value = 'Password reset successfully!'

    // Auto-redirect to auth after 2 seconds
    redirectTimeout = setTimeout(() => {
      router.push('/auth')
    }, 2000)
  } catch (err) {
    error.value = err.message || 'Failed to reset password. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  // Verify there's a valid reset session from the email link
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    error.value = 'Invalid or expired reset link. Please request a new password reset.'
    isLoading.value = true
  }
})

onBeforeUnmount(() => {
  if (redirectTimeout) clearTimeout(redirectTimeout)
})
</script>
