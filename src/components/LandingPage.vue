<template>
  <div class="landing-page">
    <div class="landing-hero">
      <h1>Ship Your App in Days, Not Months</h1>
      <p class="landing-subtitle">
        32 guided tasks to take your app from idea to first 10 paying customers.
        AI-powered copy, proven templates, and a step-by-step playbook.
      </p>
      <div class="landing-cta">
        <router-link to="/auth" class="btn btn-primary btn-lg">
          Get Started Free
        </router-link>
      </div>
    </div>

    <div class="landing-phases">
      <div v-for="phase in phases" :key="phase.number" class="phase-card">
        <span class="phase-badge" :class="`tier-${phase.tier}`">{{ phase.tier }}</span>
        <h3>Phase {{ phase.number }}: {{ phase.label }}</h3>
        <p>{{ phase.taskCount }} tasks</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { phases } from '@/tasks/index.js'
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.landing-hero {
  max-width: 700px;
  margin-bottom: 3rem;
}

.landing-hero h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--color-cyan), var(--color-magenta));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.landing-subtitle {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.landing-cta .btn-lg {
  padding: 0.75rem 2rem;
  font-size: 1.125rem;
}

.landing-phases {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  max-width: 900px;
  width: 100%;
}

.phase-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 1.5rem;
  text-align: left;
}

.phase-badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.tier-free { color: var(--color-cyan); border: 1px solid var(--color-cyan); }
.tier-launcher { color: var(--color-yellow); border: 1px solid var(--color-yellow); }
.tier-pro { color: var(--color-magenta); border: 1px solid var(--color-magenta); }

.phase-card h3 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.phase-card p {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}
</style>
