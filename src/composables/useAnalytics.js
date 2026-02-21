/**
 * GA4 event tracking composable.
 * Wraps window.gtag calls so components stay clean.
 * No-ops if gtag is not loaded (dev environment / ad blockers).
 *
 * Events tracked:
 * - sign_up         → method: source (hero, pricing, cta)
 * - page_view       → page_title: 'Pricing'
 * - cta_click       → location: (hero, navbar, final-cta, pricing-free, pricing-launcher, pricing-pro)
 * - email_capture   → source: (hero)
 */
export function useAnalytics() {
  function trackEvent(name, params = {}) {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', name, params)
    }
  }

  return {
    trackSignup: (source) => trackEvent('sign_up', { method: source }),
    trackPricingView: () => trackEvent('page_view', { page_title: 'Pricing' }),
    trackCtaClick: (location) => trackEvent('cta_click', { location }),
    trackEmailCapture: (source) => trackEvent('email_capture', { source })
  }
}
