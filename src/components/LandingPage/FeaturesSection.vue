<template>
  <section id="features" class="features section">
    <div class="section__inner">
      <div class="section__header">
        <span class="badge badge-primary">How it works</span>
        <h2 class="section__title">Everything you need.<br>Nothing you don't.</h2>
        <p class="section__subtitle">
          Built for devs who'd rather ship than study marketing textbooks.
        </p>
      </div>

      <div class="features__grid">
        <div v-for="feature in features" :key="feature.title" class="features__block">
          <div class="features__block-icon" :style="{ color: feature.accentColor }">
            {{ feature.icon }}
          </div>
          <div class="features__block-body">
            <h3 class="features__block-title" :style="{ color: feature.accentColor }">
              {{ feature.title }}
            </h3>
            <p class="features__block-desc">{{ feature.description }}</p>
            <div class="features__block-example">
              <span class="features__example-label">Example:</span>
              {{ feature.example }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const features = [
  {
    icon: '⚡',
    title: 'AI-Powered Copy Generation',
    accentColor: 'var(--cyberpunk-primary)',
    description:
      'Tell LaunchPilot what your app does and it generates your positioning statement, hero copy, email sequences, and launch posts. No blank-page paralysis.',
    example:
      '"Write my Product Hunt tagline" → LaunchPilot outputs 3 variants in 10 seconds, tailored to your target customer.'
  },
  {
    icon: '📋',
    title: 'Proven Task Sequences',
    accentColor: 'var(--cyberpunk-highlight)',
    description:
      '32 tasks in the order that actually works. Pre-launch prep before the launch, retention before paid acquisition. No wasted effort on the wrong thing at the wrong time.',
    example:
      'Task 8: "Submit to 5 directories" comes with a pre-built submission template and a list of the directories that still drive traffic.'
  },
  {
    icon: '🔒',
    title: 'Templates That Ship',
    accentColor: 'var(--cyberpunk-accent)',
    description:
      'Every task comes with copy templates, checklists, and decision frameworks. Clone, edit, publish. No starting from scratch every time.',
    example:
      'Cold email template for reaching out to potential early adopters — 47% open rate in testing.'
  }
]
</script>

<style scoped>
.section {
  padding: 6rem 1.5rem;
}

.section__inner {
  max-width: 1100px;
  margin: 0 auto;
}

.section__header {
  text-align: center;
  margin-bottom: 4rem;
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

.features__grid {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.features__block {
  display: grid;
  grid-template-columns: 80px 1fr;
  gap: 2rem;
  padding: 2rem;
  background: var(--cyberpunk-surface);
  border: 1px solid var(--cyberpunk-border);
  transition: border-color 0.3s, box-shadow 0.3s;
}

.features__block:hover {
  border-color: var(--cyberpunk-border-strong);
  box-shadow: 0 0 24px rgba(0, 217, 255, 0.08);
}

.features__block-icon {
  font-size: 2.5rem;
  line-height: 1;
  padding-top: 0.25rem;
  text-align: center;
}

.features__block-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.625rem;
  line-height: 1.3;
}

.features__block-desc {
  color: var(--cyberpunk-text-secondary);
  font-size: 0.95rem;
  line-height: 1.65;
  margin-bottom: 1rem;
}

.features__block-example {
  background: var(--cyberpunk-dark);
  border: 1px solid var(--cyberpunk-border);
  border-left: 3px solid var(--cyberpunk-primary);
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  color: var(--cyberpunk-text-secondary);
  font-family: var(--font-mono);
  line-height: 1.5;
}

.features__example-label {
  color: var(--cyberpunk-primary);
  font-weight: 600;
  margin-right: 0.25rem;
}

@media (max-width: 600px) {
  .features__block {
    grid-template-columns: 1fr;
  }

  .features__block-icon {
    text-align: left;
  }
}
</style>
