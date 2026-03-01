<template>
  <section class="mid-capture">
    <div class="mid-capture__inner">
      <p class="mid-capture__label">Get launch updates</p>
      <h2 class="mid-capture__headline">
        Not ready to start? <span class="mid-capture__accent">Stay in the loop.</span>
      </h2>
      <p class="mid-capture__sub">
        Join the mailing list for launch tips, new tasks, and indie dev strategies.
        No spam. Unsubscribe anytime.
      </p>
      <form
        v-if="!submitted"
        class="mid-capture__form"
        @submit.prevent="captureEmail"
      >
        <input
          v-model="email"
          type="email"
          placeholder="your@email.com"
          class="mid-capture__input"
          :disabled="loading"
          required
        />
        <button
          type="submit"
          class="btn-primary mid-capture__btn"
          :disabled="loading"
        >
          {{ loading ? 'Subscribing...' : 'Subscribe' }}
        </button>
      </form>
      <p v-if="submitted" class="mid-capture__success">
        You're on the list. We'll be in touch.
      </p>
      <p v-if="error" class="mid-capture__error">{{ error }}</p>
    </div>
  </section>
</template>

<script setup>
import { useEmailCapture } from '@/composables/useEmailCapture'

const { email, submitted, loading, error, captureEmail } = useEmailCapture('mid-page')
</script>

<style scoped>
.mid-capture {
  background: var(--cyberpunk-dark-secondary);
  border-top: 1px solid var(--cyberpunk-border);
  border-bottom: 1px solid var(--cyberpunk-border);
  padding: 4rem 1.5rem;
  text-align: center;
}

.mid-capture__inner {
  max-width: 600px;
  margin: 0 auto;
}

.mid-capture__label {
  font-size: 0.75rem;
  color: var(--cyberpunk-primary);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-family: var(--font-mono);
  margin-bottom: 1rem;
}

.mid-capture__headline {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 800;
  color: var(--cyberpunk-text);
  margin-bottom: 0.75rem;
  line-height: 1.2;
}

.mid-capture__accent {
  color: var(--cyberpunk-primary);
}

.mid-capture__sub {
  font-size: 0.95rem;
  color: var(--cyberpunk-text-secondary);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.mid-capture__form {
  display: flex;
  gap: 0;
  max-width: 420px;
  margin: 0 auto;
}

.mid-capture__input {
  flex: 1;
  border-right: none;
  font-size: 0.9rem;
  padding: 0.75rem 1rem;
}

.mid-capture__btn {
  flex-shrink: 0;
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  white-space: nowrap;
}

.mid-capture__success {
  color: #00ff88;
  font-size: 0.9rem;
  font-family: var(--font-mono);
}

.mid-capture__error {
  color: var(--cyberpunk-accent-light);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

@media (max-width: 480px) {
  .mid-capture {
    padding: 3rem 1rem;
  }

  .mid-capture__form {
    flex-direction: column;
  }

  .mid-capture__input {
    border-right: 2px solid var(--cyberpunk-border);
  }
}
</style>
