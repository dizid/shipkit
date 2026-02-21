<template>
  <div class="min-h-screen flex items-center justify-center px-4" style="background: var(--cyberpunk-dark);">
    <div class="w-full max-w-md" style="border: 1px solid var(--cyberpunk-border); background: var(--cyberpunk-surface); padding: 2.5rem;">

      <!-- Header -->
      <div class="mb-8">
        <div class="mb-4">
          <span class="badge badge-primary text-xs">LAUNCHPILOT</span>
        </div>
        <h1 class="text-2xl font-bold mb-2" style="font-family: var(--font-display); color: var(--cyberpunk-text);">
          {{ isSignUp ? 'Create Account' : 'Welcome Back' }}
        </h1>
        <p style="color: var(--cyberpunk-text-secondary); font-size: 0.9rem;">
          {{ isSignUp ? 'Start your 32-step launch journey' : 'Sign in to your LaunchPilot account' }}
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

      <!-- Auth Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Email -->
        <div>
          <label
            for="email"
            class="block text-xs font-semibold mb-2"
            style="color: var(--cyberpunk-text-secondary); letter-spacing: 0.5px; text-transform: uppercase; font-family: var(--font-mono);"
          >
            Email Address
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="you@example.com"
            required
            :disabled="isLoading"
          />
        </div>

        <!-- Password -->
        <div>
          <label
            for="password"
            class="block text-xs font-semibold mb-2"
            style="color: var(--cyberpunk-text-secondary); letter-spacing: 0.5px; text-transform: uppercase; font-family: var(--font-mono);"
          >
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            :placeholder="isSignUp ? 'At least 6 characters' : '••••••••'"
            required
            :disabled="isLoading"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="btn-primary w-full mt-6"
          style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;"
        >
          <svg v-if="isLoading" class="animate-spin" style="width: 1rem; height: 1rem;" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{{ isLoading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In') }}</span>
        </button>
      </form>

      <!-- Toggle sign in / sign up -->
      <div class="mt-6 text-center">
        <p style="color: var(--cyberpunk-text-secondary); font-size: 0.875rem;">
          {{ isSignUp ? 'Already have an account?' : "Don't have an account?" }}
          <button
            @click="handleToggle"
            :disabled="isLoading"
            class="ml-1"
            style="background: none; border: none; color: var(--cyberpunk-primary); font-weight: 600; cursor: pointer; padding: 0;"
          >
            {{ isSignUp ? 'Sign In' : 'Sign Up' }}
          </button>
        </p>
      </div>

      <!-- Forgot Password -->
      <div v-if="!isSignUp" class="mt-3 text-center">
        <button
          @click="showForgotPassword = true"
          :disabled="isLoading"
          style="background: none; border: none; color: var(--cyberpunk-text-tertiary); font-size: 0.8rem; cursor: pointer; padding: 0;"
        >
          Forgot password?
        </button>
      </div>
    </div>

    <!-- Password Reset Modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showForgotPassword"
          class="fixed inset-0 flex items-center justify-center px-4"
          style="background: rgba(10, 14, 39, 0.9); z-index: 50;"
        >
          <div
            class="w-full max-w-md p-8"
            style="background: var(--cyberpunk-surface); border: 1px solid var(--cyberpunk-border-strong);"
          >
            <h2
              class="text-xl font-bold mb-2"
              style="font-family: var(--font-display); color: var(--cyberpunk-text);"
            >
              Reset Password
            </h2>
            <p class="mb-4" style="color: var(--cyberpunk-text-secondary); font-size: 0.875rem;">
              Enter your email and we'll send you a reset link.
            </p>

            <input
              v-model="resetEmail"
              type="email"
              placeholder="your@example.com"
              class="mb-4"
            />

            <div
              v-if="resetMessage"
              class="mb-4 p-3"
              :style="resetMessage.includes('sent') ? 'background: rgba(0,255,136,0.1); border: 1px solid #00ff88; color: #00ff88;' : 'background: rgba(201,0,79,0.1); border: 1px solid var(--cyberpunk-accent); color: var(--cyberpunk-accent-light);'"
              style="font-size: 0.875rem;"
            >
              {{ resetMessage }}
            </div>

            <div class="flex gap-3">
              <button
                @click="handlePasswordReset"
                :disabled="resetLoading"
                class="btn-primary flex-1"
              >
                {{ resetLoading ? 'Sending...' : 'Send Reset Link' }}
              </button>
              <button
                @click="showForgotPassword = false"
                class="btn-ghost flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { resetPassword } from '@/utils/supabase'

const router = useRouter()
const authStore = useAuthStore()

const isSignUp = ref(false)
const email = ref('')
const password = ref('')
const error = ref('')
const message = ref('')
const isLoading = ref(false)

const showForgotPassword = ref(false)
const resetEmail = ref('')
const resetLoading = ref(false)
const resetMessage = ref('')

// Timeout tracking for cleanup
let signupRedirectTimeout = null
let loginRedirectTimeout = null

const validateEmail = (emailValue) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(emailValue)
}

const clearErrors = () => {
  error.value = ''
  message.value = ''
}

const handleToggle = () => {
  isSignUp.value = !isSignUp.value
  clearErrors()
  email.value = ''
  password.value = ''
}

const handleSubmit = async () => {
  clearErrors()

  if (!validateEmail(email.value)) {
    error.value = 'Please enter a valid email address'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  isLoading.value = true

  try {
    if (isSignUp.value) {
      const result = await authStore.handleSignUp(email.value, password.value)
      if (!result.success) {
        error.value = result.error?.message || 'Sign up failed. Please check your email is valid.'
        return
      }

      if (result.requiresConfirmation) {
        message.value = result.message
      } else {
        message.value = result.message
        signupRedirectTimeout = setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      }

      email.value = ''
      password.value = ''
      isSignUp.value = false
    } else {
      const result = await authStore.handleSignIn(email.value, password.value)
      if (!result.success) {
        error.value = result.error?.message || 'Invalid login credentials'
        return
      }
      message.value = 'Login successful! Redirecting...'
      loginRedirectTimeout = setTimeout(() => {
        router.push('/dashboard')
      }, 500)
    }
  } catch (err) {
    error.value = err.message || 'An error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const handlePasswordReset = async () => {
  if (!validateEmail(resetEmail.value)) {
    resetMessage.value = 'Please enter a valid email address'
    return
  }

  resetLoading.value = true
  try {
    const result = await resetPassword(resetEmail.value)

    if (!result.success) {
      resetMessage.value = result.error
      return
    }

    resetMessage.value = 'Reset link sent! Check your email.'
    resetEmail.value = ''
    setTimeout(() => {
      showForgotPassword.value = false
      resetMessage.value = ''
    }, 4000)
  } catch (err) {
    resetMessage.value = err.message || 'Failed to send reset link.'
  } finally {
    resetLoading.value = false
  }
}

onBeforeUnmount(() => {
  if (signupRedirectTimeout) clearTimeout(signupRedirectTimeout)
  if (loginRedirectTimeout) clearTimeout(loginRedirectTimeout)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
