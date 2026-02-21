<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <span class="footer__logo">Ship<span class="footer__logo-accent">Kit</span></span>
        <p class="footer__tagline">From shipped to paid.</p>
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
</style>
