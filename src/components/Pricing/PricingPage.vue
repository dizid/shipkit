<template>
  <div class="pricing-page">
    <!-- Page hero -->
    <section class="pricing-page__hero">
      <div class="pricing-page__hero-inner">
        <h1 class="pricing-page__title">
          Simple pricing.<br>
          <span class="pricing-page__title-accent">Honest value.</span>
        </h1>
        <p class="pricing-page__sub">
          Start free. Upgrade when you're ready to go all-in on your launch.
          30-day money-back guarantee on all paid plans.
        </p>
      </div>
    </section>

    <!-- Reuse the shared pricing section component -->
    <PricingSection />

    <!-- FAQ teaser -->
    <section class="pricing-page__faq-teaser">
      <div class="pricing-page__faq-inner">
        <h2 class="pricing-page__faq-title">Still have questions?</h2>
        <p class="pricing-page__faq-desc">
          Check the <router-link to="/#faq" class="pricing-page__faq-link">FAQ on the home page</router-link>
          or email us at
          <a href="mailto:hello@shipkit.app" class="pricing-page__faq-link">hello@shipkit.app</a>.
          We reply within 24 hours.
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import PricingSection from '@/components/LandingPage/PricingSection.vue'
import { useAnalytics } from '@/composables/useAnalytics'
import { onMounted } from 'vue'

const { trackPricingView } = useAnalytics()

onMounted(() => {
  // GA4: page_view with page_title: 'Pricing'
  trackPricingView()
})
</script>

<style scoped>
.pricing-page {
  min-height: 100vh;
  background: var(--cyberpunk-dark);
}

.pricing-page__hero {
  padding: 7rem 1.5rem 2rem;
  text-align: center;
  border-bottom: 1px solid var(--cyberpunk-border);
}

.pricing-page__hero-inner {
  max-width: 640px;
  margin: 0 auto;
}

.pricing-page__title {
  font-family: var(--font-display);
  font-size: clamp(2.25rem, 6vw, 3.5rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1.25rem;
  color: var(--cyberpunk-text);
  letter-spacing: -2px;
}

.pricing-page__title-accent {
  color: var(--cyberpunk-highlight);
}

.pricing-page__sub {
  color: var(--cyberpunk-text-secondary);
  font-size: 1.05rem;
  line-height: 1.65;
}

/* FAQ teaser */
.pricing-page__faq-teaser {
  padding: 4rem 1.5rem;
  text-align: center;
  background: var(--cyberpunk-dark);
}

.pricing-page__faq-inner {
  max-width: 560px;
  margin: 0 auto;
}

.pricing-page__faq-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--cyberpunk-text);
  margin-bottom: 0.75rem;
}

.pricing-page__faq-desc {
  color: var(--cyberpunk-text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
}

.pricing-page__faq-link {
  color: var(--cyberpunk-primary);
  text-decoration: none;
  transition: color 0.2s;
}

.pricing-page__faq-link:hover {
  color: var(--cyberpunk-primary-light);
  text-decoration: underline;
}
</style>
