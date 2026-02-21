<template>
  <section id="pricing" class="pricing section">
    <div class="section__inner">
      <div class="section__header">
        <span class="badge badge-highlight">Pricing</span>
        <h2 class="section__title">Simple pricing.<br>No surprises.</h2>
        <p class="section__subtitle">
          Start free. Upgrade when you're ready to go all-in on your launch.
        </p>
      </div>

      <div class="pricing__grid">
        <!-- Free -->
        <div class="pricing__card pricing__card--free">
          <div class="pricing__card-tier">Free</div>
          <div class="pricing__price">
            <span class="pricing__amount">$0</span>
            <span class="pricing__period">forever</span>
          </div>
          <p class="pricing__desc">
            Get started with Phase 1 and validate your idea before spending a cent.
          </p>
          <ul class="pricing__features">
            <li v-for="f in freeFeatures" :key="f">
              <span class="pricing__check pricing__check--free">✓</span> {{ f }}
            </li>
          </ul>
          <router-link
            to="/auth"
            class="pricing__cta btn-ghost"
            @click="trackCta('pricing-free')"
          >
            Get Started Free
          </router-link>
        </div>

        <!-- Launcher — Most Popular -->
        <div class="pricing__card pricing__card--launcher">
          <div class="pricing__popular-badge">MOST POPULAR</div>
          <div class="pricing__card-tier">Launcher</div>
          <div class="pricing__price">
            <span class="pricing__amount">$29</span>
            <span class="pricing__period">one-time</span>
          </div>
          <p class="pricing__desc">
            Everything you need to go from zero to your first paying customers.
          </p>
          <ul class="pricing__features">
            <li v-for="f in launcherFeatures" :key="f">
              <span class="pricing__check pricing__check--launcher">✓</span> {{ f }}
            </li>
          </ul>
          <router-link
            to="/auth"
            class="pricing__cta btn-highlight"
            @click="trackCta('pricing-launcher')"
          >
            Get Launcher — $29
          </router-link>
        </div>

        <!-- Pro -->
        <div class="pricing__card pricing__card--pro">
          <div class="pricing__card-tier">Pro</div>
          <div class="pricing__price">
            <span class="pricing__amount">$9</span>
            <span class="pricing__period">/month</span>
          </div>
          <p class="pricing__desc">
            Everything in Launcher plus monthly new strategies and priority support.
          </p>
          <ul class="pricing__features">
            <li v-for="f in proFeatures" :key="f">
              <span class="pricing__check pricing__check--pro">✓</span> {{ f }}
            </li>
          </ul>
          <router-link
            to="/auth"
            class="pricing__cta btn-accent"
            @click="trackCta('pricing-pro')"
          >
            Get Pro — $9/mo
          </router-link>
        </div>
      </div>

      <p class="pricing__footer-note">
        All plans include a 30-day money-back guarantee. No questions asked.
      </p>
    </div>
  </section>
</template>

<script setup>
import { useAnalytics } from '@/composables/useAnalytics'

const { trackCtaClick } = useAnalytics()

function trackCta(location) {
  trackCtaClick(location)
}

const freeFeatures = [
  'Phase 1: Pre-Launch (5 tasks)',
  'Basic AI advice (5 uses/month)',
  'Positioning template',
  'Landing page checklist',
  'Community access'
]

const launcherFeatures = [
  'Everything in Free',
  'All 32 tasks across 4 phases',
  'Unlimited AI copy generation',
  'Email sequence templates',
  'Directory submission pack',
  'Launch day playbook',
  'Cold email templates'
]

const proFeatures = [
  'Everything in Launcher',
  'Monthly new growth strategies',
  'Priority support (24h response)',
  'Lifetime updates',
  'Private Discord community',
  'Founder office hours (monthly)'
]
</script>

<style scoped>
.section {
  padding: 6rem 1.5rem;
  background: var(--cyberpunk-dark-secondary);
}

.section__inner {
  max-width: 1100px;
  margin: 0 auto;
}

.section__header {
  text-align: center;
  margin-bottom: 3rem;
}

.section__header .badge {
  margin-bottom: 1rem;
  display: inline-block;
}

.section__title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 1rem;
  color: var(--cyberpunk-text);
  letter-spacing: -1px;
}

.section__subtitle {
  color: var(--cyberpunk-text-secondary);
  font-size: 1.05rem;
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.65;
}

.pricing__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  align-items: start;
}

/* Base card */
.pricing__card {
  background: var(--cyberpunk-surface);
  padding: 2rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  position: relative;
}

/* Per-tier border */
.pricing__card--free {
  border: 2px solid var(--cyberpunk-primary);
}

.pricing__card--launcher {
  border: 2px solid var(--cyberpunk-highlight);
  transform: translateY(-8px);
  box-shadow: 0 0 40px rgba(255, 190, 11, 0.15);
}

.pricing__card--pro {
  border: 2px solid var(--cyberpunk-accent);
}

.pricing__popular-badge {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--cyberpunk-highlight);
  color: var(--cyberpunk-dark);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 0.25rem 0.75rem;
}

.pricing__card-tier {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--cyberpunk-text-secondary);
}

.pricing__card--free .pricing__card-tier { color: var(--cyberpunk-primary); }
.pricing__card--launcher .pricing__card-tier { color: var(--cyberpunk-highlight); }
.pricing__card--pro .pricing__card-tier { color: var(--cyberpunk-accent-light); }

.pricing__price {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.pricing__amount {
  font-family: var(--font-display);
  font-size: 2.75rem;
  font-weight: 900;
  color: var(--cyberpunk-text);
  letter-spacing: -2px;
}

.pricing__period {
  font-size: 0.85rem;
  color: var(--cyberpunk-text-tertiary);
}

.pricing__desc {
  font-size: 0.9rem;
  color: var(--cyberpunk-text-secondary);
  line-height: 1.55;
}

.pricing__features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  flex: 1;
}

.pricing__features li {
  font-size: 0.875rem;
  color: var(--cyberpunk-text-secondary);
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  line-height: 1.45;
}

.pricing__check {
  flex-shrink: 0;
  font-weight: 700;
}

.pricing__check--free { color: var(--cyberpunk-primary); }
.pricing__check--launcher { color: var(--cyberpunk-highlight); }
.pricing__check--pro { color: var(--cyberpunk-accent-light); }

.pricing__cta {
  display: block;
  text-align: center;
  text-decoration: none;
  padding: 0.875rem 1rem;
  font-weight: 700;
  font-size: 0.925rem;
  transition: all 0.3s;
  font-family: var(--font-body);
}

.pricing__cta.btn-highlight {
  background: var(--cyberpunk-highlight);
  color: var(--cyberpunk-dark);
}

.pricing__cta.btn-highlight:hover {
  background: var(--cyberpunk-highlight-light);
  box-shadow: 0 0 20px rgba(255, 190, 11, 0.4);
}

.pricing__cta.btn-accent {
  background: var(--cyberpunk-accent);
  color: white;
}

.pricing__cta.btn-accent:hover {
  background: var(--cyberpunk-accent-light);
  box-shadow: 0 0 20px rgba(201, 0, 79, 0.4);
}

.pricing__footer-note {
  text-align: center;
  margin-top: 2.5rem;
  font-size: 0.85rem;
  color: var(--cyberpunk-text-tertiary);
}

@media (max-width: 900px) {
  .pricing__grid {
    grid-template-columns: 1fr;
    max-width: 480px;
    margin: 0 auto;
  }

  .pricing__card--launcher {
    transform: none;
    order: -1;
  }
}
</style>
