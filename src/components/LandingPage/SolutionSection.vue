<template>
  <section id="solution" class="solution section">
    <div class="section__inner">
      <div class="section__header">
        <span class="badge badge-primary">The system</span>
        <h2 class="section__title">4 phases. 32 tasks.<br>One clear path to customers.</h2>
        <p class="section__subtitle">
          ShipKit gives you the exact playbook in the right order, with AI doing the heavy lifting on copy and templates.
        </p>
      </div>

      <div class="solution__grid">
        <div
          v-for="phase in phases"
          :key="phase.number"
          class="card solution__card"
          :class="`solution__card--${phase.tier}`"
        >
          <div class="solution__card-header">
            <span class="solution__phase-num">{{ phase.number.toString().padStart(2, '0') }}</span>
            <span class="badge" :class="tierBadgeClass(phase.tier)">{{ tierLabel(phase.tier) }}</span>
          </div>
          <h3 class="solution__card-title">{{ phase.label }}</h3>
          <p class="solution__task-count">{{ phase.taskCount }} tasks</p>
          <ul class="solution__bullets">
            <li v-for="bullet in phase.bullets" :key="bullet">{{ bullet }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { phases as rawPhases } from '@/tasks/index.js'

// Augment with bullet descriptions per phase
const phaseBullets = {
  1: [
    'Validate your idea before building',
    'Write positioning that actually converts',
    'Set up the foundation (domain, analytics, landing page)'
  ],
  2: [
    'Submit to launch directories',
    'Generate first-week traffic via Product Hunt and communities',
    'Capture leads and convert early adopters'
  ],
  3: [
    'Build email sequences that sell for you',
    'Drive SEO and content distribution',
    'Turn signups into paying customers with proven outreach'
  ],
  4: [
    'Set up referral and affiliate programs',
    'Optimize LTV with upgrade and retention flows',
    'Build systems for sustainable growth'
  ]
}

const phases = rawPhases.map(p => ({ ...p, bullets: phaseBullets[p.number] }))

function tierBadgeClass(tier) {
  return {
    free: 'badge-primary',
    launcher: 'badge-highlight',
    pro: 'badge-accent'
  }[tier]
}

function tierLabel(tier) {
  return {
    free: 'Free',
    launcher: 'Launcher',
    pro: 'Pro'
  }[tier]
}
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

.solution__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.solution__card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative;
}

/* Left border accent per tier */
.solution__card--free {
  border-left: 3px solid var(--cyberpunk-primary);
}

.solution__card--launcher {
  border-left: 3px solid var(--cyberpunk-highlight);
}

.solution__card--pro {
  border-left: 3px solid var(--cyberpunk-accent);
}

.solution__card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.solution__phase-num {
  font-family: var(--font-mono);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--cyberpunk-border-strong);
  line-height: 1;
}

.solution__card-title {
  font-family: var(--font-display);
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--cyberpunk-text);
  line-height: 1.3;
}

.solution__task-count {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--cyberpunk-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.solution__bullets {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.solution__bullets li {
  font-size: 0.85rem;
  color: var(--cyberpunk-text-secondary);
  line-height: 1.5;
  padding-left: 1rem;
  position: relative;
}

.solution__bullets li::before {
  content: '›';
  position: absolute;
  left: 0;
  color: var(--cyberpunk-primary);
  font-weight: 700;
}

@media (max-width: 1024px) {
  .solution__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .solution__grid {
    grid-template-columns: 1fr;
  }
}
</style>
