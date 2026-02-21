<template>
  <div class="landing-page">
    <NavBar />
    <HeroSection />
    <ProblemSection />
    <SolutionSection />
    <FeaturesSection />
    <PricingSection />
    <ComparisonSection />
    <FaqSection />
    <FinalCtaSection />
    <FooterSection />
  </div>
</template>

<script setup>
import NavBar from '@/components/LandingPage/NavBar.vue'
import HeroSection from '@/components/LandingPage/HeroSection.vue'
import ProblemSection from '@/components/LandingPage/ProblemSection.vue'
import SolutionSection from '@/components/LandingPage/SolutionSection.vue'
import FeaturesSection from '@/components/LandingPage/FeaturesSection.vue'
import PricingSection from '@/components/LandingPage/PricingSection.vue'
import ComparisonSection from '@/components/LandingPage/ComparisonSection.vue'
import FaqSection from '@/components/LandingPage/FaqSection.vue'
import FinalCtaSection from '@/components/LandingPage/FinalCtaSection.vue'
import FooterSection from '@/components/LandingPage/FooterSection.vue'
</script>

<style scoped>
.landing-page {
  background: var(--cyberpunk-dark);
  min-height: 100vh;
}
</style>
