<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <span class="footer__logo">Launch<span class="footer__logo-accent">Pilot</span></span>
        <p class="footer__tagline">From shipped to paid.</p>
      </div>

      <!-- Email capture -->
      <div class="footer__capture">
        <p class="footer__capture-label">Get launch tips in your inbox:</p>
        <form
          v-if="!submitted"
          class="footer__capture-form"
          @submit.prevent="captureEmail"
        >
          <input
            v-model="email"
            type="email"
            placeholder="your@email.com"
            class="footer__capture-input"
            :disabled="loading"
            required
          />
          <button
            type="submit"
            class="btn-primary footer__capture-btn"
            :disabled="loading"
          >
            {{ loading ? '...' : 'Subscribe' }}
          </button>
        </form>
        <p v-if="submitted" class="footer__capture-success">Subscribed!</p>
        <p v-if="error" class="footer__capture-error">{{ error }}</p>
      </div>

      <nav class="footer__links" aria-label="Footer navigation">
        <router-link to="/pricing" class="footer__link">Pricing</router-link>
        <a href="#" class="footer__link">Privacy</a>
        <a href="#" class="footer__link">Terms</a>
        <a
          href="https://x.com"
          target="_blank"
          rel="noopener noreferrer"
          class="footer__link"
          aria-label="Follow on X (Twitter)"
        >Twitter / X</a>
      </nav>

      <p class="footer__copy">
        &copy; {{ currentYear }} LaunchPilot. Built by an indie dev, for indie devs.
      </p>
    </div>
  </footer>
</template>

<script setup>
import { useEmailCapture } from '@/composables/useEmailCapture'

const { email, submitted, loading, error, captureEmail } = useEmailCapture('footer')
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: var(--cyberpunk-dark-secondary);
  border-top: 1px solid var(--cyberpunk-border);
  padding: 3rem 1.5rem 2rem;
}

.footer__inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  text-align: center;
}

.footer__brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
}

.footer__logo {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--cyberpunk-text);
}

.footer__logo-accent {
  color: var(--cyberpunk-primary);
}

.footer__tagline {
  font-size: 0.8rem;
  color: var(--cyberpunk-text-tertiary);
  font-family: var(--font-mono);
}

/* Email capture */
.footer__capture {
  width: 100%;
  max-width: 420px;
}

.footer__capture-label {
  font-size: 0.8rem;
  color: var(--cyberpunk-text-tertiary);
  margin-bottom: 0.5rem;
  font-family: var(--font-mono);
}

.footer__capture-form {
  display: flex;
  gap: 0;
}

.footer__capture-input {
  flex: 1;
  border-right: none;
  font-size: 0.85rem;
  padding: 0.625rem 0.875rem;
}

.footer__capture-btn {
  flex-shrink: 0;
  padding: 0.625rem 1rem;
  font-size: 0.8rem;
  white-space: nowrap;
}

.footer__capture-success {
  color: #00ff88;
  font-size: 0.85rem;
  font-family: var(--font-mono);
}

.footer__capture-error {
  color: var(--cyberpunk-accent-light);
  font-size: 0.8rem;
  margin-top: 0.375rem;
}

.footer__links {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.footer__link {
  color: var(--cyberpunk-text-secondary);
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.footer__link:hover {
  color: var(--cyberpunk-primary);
}

.footer__copy {
  color: var(--cyberpunk-text-tertiary);
  font-size: 0.8rem;
  margin: 0;
}

@media (max-width: 480px) {
  .footer__capture-form {
    flex-direction: column;
  }

  .footer__capture-input {
    border-right: 2px solid var(--cyberpunk-border);
  }
}
</style>
