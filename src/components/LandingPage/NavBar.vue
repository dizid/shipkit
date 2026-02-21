<template>
  <nav class="navbar" :class="{ 'navbar--scrolled': scrolled }">
    <div class="navbar__inner">
      <!-- Logo -->
      <router-link to="/" class="navbar__logo">
        <span class="navbar__logo-text">Ship</span><span class="navbar__logo-accent">Kit</span>
      </router-link>

      <!-- Desktop nav links -->
      <ul class="navbar__links">
        <li><a href="#features" class="navbar__link" @click.prevent="scrollTo('features')">Features</a></li>
        <li><a href="#pricing" class="navbar__link" @click.prevent="scrollTo('pricing')">Pricing</a></li>
        <li><a href="#faq" class="navbar__link" @click.prevent="scrollTo('faq')">FAQ</a></li>
      </ul>

      <!-- CTA -->
      <div class="navbar__cta">
        <router-link to="/auth" class="btn-primary navbar__cta-btn" @click="track('navbar')">
          Get Started Free
        </router-link>
      </div>

      <!-- Mobile hamburger -->
      <button class="navbar__hamburger" @click="menuOpen = !menuOpen" aria-label="Toggle menu">
        <span class="navbar__hamburger-bar" :class="{ open: menuOpen }"></span>
        <span class="navbar__hamburger-bar" :class="{ open: menuOpen }"></span>
        <span class="navbar__hamburger-bar" :class="{ open: menuOpen }"></span>
      </button>
    </div>

    <!-- Mobile dropdown -->
    <div class="navbar__mobile" :class="{ 'navbar__mobile--open': menuOpen }">
      <a href="#features" class="navbar__mobile-link" @click="mobileNav('features')">Features</a>
      <a href="#pricing" class="navbar__mobile-link" @click="mobileNav('pricing')">Pricing</a>
      <a href="#faq" class="navbar__mobile-link" @click="mobileNav('faq')">FAQ</a>
      <router-link to="/auth" class="btn-primary navbar__mobile-cta" @click="track('navbar-mobile')">
        Get Started Free
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAnalytics } from '@/composables/useAnalytics'

const { trackCtaClick } = useAnalytics()
const scrolled = ref(false)
const menuOpen = ref(false)

function track(location) {
  trackCtaClick(location)
}

function scrollTo(id) {
  menuOpen.value = false
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function mobileNav(id) {
  menuOpen.value = false
  scrollTo(id)
}

function onScroll() {
  scrolled.value = window.scrollY > 40
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  transition: background 0.3s, backdrop-filter 0.3s, border-color 0.3s;
  border-bottom: 1px solid transparent;
}

.navbar--scrolled {
  background: rgba(10, 14, 39, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom-color: var(--cyberpunk-border);
}

.navbar__inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.navbar__logo {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  text-decoration: none;
  letter-spacing: -0.5px;
  flex-shrink: 0;
}

.navbar__logo-text {
  color: var(--cyberpunk-text);
}

.navbar__logo-accent {
  color: var(--cyberpunk-primary);
}

.navbar__links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
  flex: 1;
}

.navbar__link {
  color: var(--cyberpunk-text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s;
}

.navbar__link:hover {
  color: var(--cyberpunk-primary);
}

.navbar__cta {
  flex-shrink: 0;
}

.navbar__cta-btn {
  font-size: 0.875rem;
  padding: 0.5rem 1.25rem;
  text-decoration: none;
  display: inline-block;
}

.navbar__hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: transparent;
  padding: 4px;
  margin-left: auto;
  border: none;
}

.navbar__hamburger-bar {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--cyberpunk-text-secondary);
  transition: transform 0.25s, opacity 0.25s;
}

.navbar__hamburger-bar.open:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.navbar__hamburger-bar.open:nth-child(2) { opacity: 0; }
.navbar__hamburger-bar.open:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.navbar__mobile {
  display: none;
  flex-direction: column;
  padding: 1rem 1.5rem 1.5rem;
  background: rgba(10, 14, 39, 0.97);
  border-top: 1px solid var(--cyberpunk-border);
  gap: 0.5rem;
}

.navbar__mobile--open {
  display: flex;
}

.navbar__mobile-link {
  color: var(--cyberpunk-text-secondary);
  text-decoration: none;
  font-size: 1rem;
  padding: 0.625rem 0;
  border-bottom: 1px solid var(--cyberpunk-border);
  transition: color 0.2s;
}

.navbar__mobile-link:hover {
  color: var(--cyberpunk-primary);
}

.navbar__mobile-cta {
  margin-top: 1rem;
  text-decoration: none;
  text-align: center;
  display: block;
  padding: 0.75rem;
}

@media (max-width: 768px) {
  .navbar__links,
  .navbar__cta {
    display: none;
  }

  .navbar__hamburger {
    display: flex;
  }
}
</style>
