<template>
  <section id="problems" class="problems section">
    <div class="section__inner">
      <div class="section__header">
        <span class="badge badge-accent">The reality</span>
        <h2 class="section__title">You built the thing.<br>Now what?</h2>
        <p class="section__subtitle">
          Most indie devs ship great software and then stall out on everything that comes after the code.
        </p>
      </div>

      <div class="problems__grid">
        <div v-for="problem in problems" :key="problem.title" class="card problems__card">
          <span class="problems__icon" aria-hidden="true">{{ problem.icon }}</span>
          <h3 class="problems__card-title">{{ problem.title }}</h3>
          <p class="problems__card-desc">{{ problem.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const problems = [
  {
    icon: '🗺️',
    title: 'No map for what to do after launch',
    description:
      'You finished the app but have no system for distribution, positioning, or turning traffic into paying customers. Every week you wing it.'
  },
  {
    icon: '⏳',
    title: 'Marketing eats all the time you need to build',
    description:
      'Writing copy, setting up analytics, posting to directories — it\'s a second full-time job. You didn\'t sign up to be a marketer.'
  },
  {
    icon: '🎯',
    title: 'You don\'t know which moves actually matter',
    description:
      'There\'s infinite advice online and none of it is in the right order. You end up optimizing the wrong things at the wrong stage.'
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

.problems__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.problems__card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border-left: 3px solid var(--cyberpunk-accent);
}

.problems__icon {
  font-size: 2rem;
  line-height: 1;
}

.problems__card-title {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--cyberpunk-text);
  line-height: 1.3;
}

.problems__card-desc {
  color: var(--cyberpunk-text-secondary);
  font-size: 0.9rem;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .problems__grid {
    grid-template-columns: 1fr;
  }
}
</style>
