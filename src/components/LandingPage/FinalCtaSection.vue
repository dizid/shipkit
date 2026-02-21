<template>
  <section class="final-cta">
    <!-- Background glow -->
    <div class="final-cta__glow" aria-hidden="true"></div>

    <div class="final-cta__content">
      <h2 class="final-cta__headline">
        Your app deserves customers.<br>
        <span class="final-cta__headline-accent">Start the checklist today.</span>
      </h2>
      <p class="final-cta__sub">
        Phase 1 is free. No credit card. No commitment.
        Just you and a clear path to your first paying users.
      </p>
      <router-link
        to="/auth"
        class="btn-primary final-cta__btn"
        @click="trackCtaClick('final-cta')"
      >
        Get Started Free — Takes 2 Minutes
      </router-link>
      <div class="final-cta__reassurance">
        <span>5 tasks, free forever</span>
        <span class="final-cta__dot" aria-hidden="true">&middot;</span>
        <span>No credit card</span>
        <span class="final-cta__dot" aria-hidden="true">&middot;</span>
        <span>30-day refund on paid plans</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useAnalytics } from '@/composables/useAnalytics'

const { trackCtaClick } = useAnalytics()
</script>

<style scoped>
.final-cta {
  position: relative;
  padding: 8rem 1.5rem;
  text-align: center;
  overflow: hidden;
  background: var(--cyberpunk-dark);
  border-top: 1px solid var(--cyberpunk-border);
}

.final-cta__glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0, 217, 255, 0.07) 0%, transparent 70%);
}

.final-cta__content {
  position: relative;
  z-index: 1;
  max-width: 680px;
  margin: 0 auto;
}

.final-cta__headline {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 900;
  line-height: 1.15;
  color: var(--cyberpunk-text);
  margin-bottom: 1.25rem;
  letter-spacing: -1.5px;
}

.final-cta__headline-accent {
  color: var(--cyberpunk-primary);
  text-shadow: 0 0 20px rgba(0, 217, 255, 0.4);
}

.final-cta__sub {
  color: var(--cyberpunk-text-secondary);
  font-size: 1.05rem;
  line-height: 1.65;
  margin-bottom: 2.5rem;
}

.final-cta__btn {
  display: inline-block;
  text-decoration: none;
  padding: 1rem 2.25rem;
  font-size: 1.05rem;
  font-weight: 700;
  font-family: var(--font-body);
  margin-bottom: 1.5rem;
  transition: all 0.3s;
}

.final-cta__btn:hover {
  box-shadow: 0 0 32px rgba(0, 217, 255, 0.35);
}

.final-cta__reassurance {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  font-size: 0.8rem;
  color: var(--cyberpunk-text-tertiary);
}

.final-cta__dot {
  opacity: 0.4;
}
</style>
