<template>
  <!-- Funnel: [Ad / organic] -> [/ hero] -> [email_capture] -> [/auth sign_up] -->
  <section class="hero">
    <!-- Background glow orbs -->
    <div class="hero__glow hero__glow--cyan" aria-hidden="true"></div>
    <div class="hero__glow hero__glow--magenta" aria-hidden="true"></div>

    <div class="hero__content">
      <!-- Eyebrow label -->
      <div class="hero__eyebrow">
        <span class="badge badge-primary">For indie developers</span>
      </div>

      <!-- Headline -->
      <h1 class="hero__headline">
        Go from<br>
        <span class="hero__headline-gradient">shipped</span>
        to
        <span class="hero__headline-gradient-alt">paid</span>.
      </h1>

      <!-- Subheadline -->
      <p class="hero__sub">
        32 battle-tested tasks across 4 phases. From validating your idea
        to landing your first 10 paying customers — with AI-generated copy,
        templates, and a step-by-step playbook that actually ships.
      </p>

      <!-- CTA buttons -->
      <div class="hero__actions">
        <router-link
          to="/auth"
          class="btn-primary hero__btn-primary"
          @click="trackCtaClick('hero')"
        >
          Start Your Launch Checklist — Free
        </router-link>
        <a
          href="#pricing"
          class="btn-ghost hero__btn-secondary"
          @click.prevent="scrollToPricing"
        >
          See Pricing
        </a>
      </div>

      <!-- Social proof -->
      <p class="hero__social-proof">
        Free forever on Phase 1 &middot; No credit card required &middot; Set up in 2 minutes
      </p>

      <!-- Email capture -->
      <div class="hero__capture">
        <p class="hero__capture-label">Or get early access updates:</p>
        <form
          v-if="!submitted"
          class="hero__capture-form"
          @submit.prevent="captureEmail"
        >
          <input
            v-model="email"
            type="email"
            placeholder="your@email.com"
            class="hero__capture-input"
            :disabled="loading"
            required
          />
          <button
            type="submit"
            class="btn-primary hero__capture-btn"
            :disabled="loading"
          >
            {{ loading ? 'Saving...' : 'Notify Me' }}
          </button>
        </form>
        <p v-if="submitted" class="hero__capture-success">
          You're on the list. We'll be in touch.
        </p>
        <p v-if="captureError" class="hero__capture-error">{{ captureError }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '@/utils/supabase'
import { useAnalytics } from '@/composables/useAnalytics'
import { useUtm } from '@/composables/useUtm'

const { trackCtaClick, trackEmailCapture } = useAnalytics()
const utm = useUtm()

const email = ref('')
const submitted = ref(false)
const loading = ref(false)
const captureError = ref(null)

async function captureEmail() {
  if (!email.value) return
  loading.value = true
  captureError.value = null
  try {
    const { error: err } = await supabase
      .from('waitlist')
      .insert({ email: email.value, source: 'hero', utm_data: utm })
    if (err) throw err
    submitted.value = true
    trackEmailCapture('hero')
  } catch (e) {
    // 23505 = unique_violation (duplicate email) — treat as success
    if (e.code === '23505') {
      submitted.value = true
    } else {
      captureError.value = 'Something went wrong. Try again.'
    }
  } finally {
    loading.value = false
  }
}

function scrollToPricing() {
  const el = document.getElementById('pricing')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8rem 1.5rem 5rem;
  overflow: hidden;
  text-align: center;
}

/* Ambient glow blobs */
.hero__glow {
  position: absolute;
  pointer-events: none;
  filter: blur(80px);
  opacity: 0.18;
  animation: glow 4s ease-in-out infinite alternate;
}

.hero__glow--cyan {
  width: 600px;
  height: 600px;
  background: var(--cyberpunk-primary);
  top: -100px;
  left: -100px;
}

.hero__glow--magenta {
  width: 500px;
  height: 500px;
  background: var(--cyberpunk-accent);
  bottom: -80px;
  right: -80px;
  animation-delay: 2s;
}

.hero__content {
  position: relative;
  z-index: 1;
  max-width: 780px;
  margin: 0 auto;
}

.hero__eyebrow {
  margin-bottom: 1.5rem;
}

.hero__headline {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 5.5rem);
  font-weight: 900;
  line-height: 1.05;
  margin-bottom: 1.5rem;
  color: var(--cyberpunk-text);
  letter-spacing: -2px;
}

.hero__headline-gradient {
  background: linear-gradient(135deg, var(--cyberpunk-primary), var(--cyberpunk-primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero__headline-gradient-alt {
  background: linear-gradient(135deg, var(--cyberpunk-highlight), var(--cyberpunk-accent-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero__sub {
  font-size: clamp(1rem, 2.5vw, 1.2rem);
  color: var(--cyberpunk-text-secondary);
  line-height: 1.7;
  margin-bottom: 2.5rem;
  max-width: 620px;
  margin-left: auto;
  margin-right: auto;
}

.hero__actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
}

.hero__btn-primary {
  font-size: 1rem;
  padding: 0.875rem 2rem;
  text-decoration: none;
  display: inline-block;
  font-family: var(--font-body);
  font-weight: 700;
  letter-spacing: 0.3px;
}

.hero__btn-secondary {
  font-size: 1rem;
  padding: 0.875rem 1.5rem;
  text-decoration: none;
  display: inline-block;
  font-family: var(--font-body);
  font-weight: 600;
}

.hero__social-proof {
  color: var(--cyberpunk-text-tertiary);
  font-size: 0.8rem;
  letter-spacing: 0.3px;
  margin-bottom: 3rem;
}

/* Email capture */
.hero__capture {
  margin-top: 1rem;
}

.hero__capture-label {
  font-size: 0.8rem;
  color: var(--cyberpunk-text-tertiary);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-family: var(--font-mono);
}

.hero__capture-form {
  display: flex;
  gap: 0;
  max-width: 420px;
  margin: 0 auto;
}

.hero__capture-input {
  flex: 1;
  border-right: none;
  font-size: 0.9rem;
  padding: 0.75rem 1rem;
}

.hero__capture-btn {
  flex-shrink: 0;
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  white-space: nowrap;
}

.hero__capture-success {
  color: #00ff88;
  font-size: 0.9rem;
  font-family: var(--font-mono);
}

.hero__capture-error {
  color: var(--cyberpunk-accent-light);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

@media (max-width: 480px) {
  .hero {
    padding: 6rem 1rem 3rem;
  }

  .hero__capture-form {
    flex-direction: column;
  }

  .hero__capture-input {
    border-right: 2px solid var(--cyberpunk-border);
  }
}
</style>
