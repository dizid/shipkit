<template>
  <section id="comparison" class="comparison section">
    <div class="section__inner">
      <div class="section__header">
        <span class="badge badge-primary">Why LaunchPilot</span>
        <h2 class="section__title">You've tried the alternatives.<br>Here's the difference.</h2>
      </div>

      <div class="comparison__grid">
        <div v-for="item in comparisons" :key="item.vs" class="card comparison__card">
          <div class="comparison__vs-header">
            <span class="comparison__vs-label">LaunchPilot vs</span>
            <h3 class="comparison__vs-name">{{ item.vs }}</h3>
          </div>

          <div class="comparison__cols">
            <!-- LaunchPilot column -->
            <div class="comparison__col comparison__col--ours">
              <div class="comparison__col-header">
                <span class="comparison__col-badge comparison__col-badge--ours">LaunchPilot</span>
              </div>
              <ul class="comparison__list">
                <li v-for="point in item.ours" :key="point">
                  <span class="comparison__icon comparison__icon--win">✓</span>
                  {{ point }}
                </li>
              </ul>
            </div>

            <!-- Divider -->
            <div class="comparison__divider" aria-hidden="true"></div>

            <!-- Other column -->
            <div class="comparison__col comparison__col--other">
              <div class="comparison__col-header">
                <span class="comparison__col-badge comparison__col-badge--other">{{ item.vs }}</span>
              </div>
              <ul class="comparison__list">
                <li v-for="point in item.other" :key="point">
                  <span class="comparison__icon comparison__icon--loss">✗</span>
                  {{ point }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const comparisons = [
  {
    vs: 'ShipFast / Boilerplates',
    ours: [
      'Teaches you the distribution and marketing system',
      'Works for any app, regardless of tech stack',
      'Covers the full go-to-market funnel',
      'AI generates your specific copy'
    ],
    other: [
      'Solves the code setup, not the customer acquisition',
      'Locked to one framework/language',
      'You still figure out launch strategy yourself',
      'Generic templates that don\'t fit your product'
    ]
  },
  {
    vs: 'Marketing Courses',
    ours: [
      'Tasks, not lectures — execute while you learn',
      'Done in hours, not weeks',
      '$29 one-time, not $500+',
      'Specific to SaaS / indie products'
    ],
    other: [
      'Information overload with no action sequence',
      '20+ hours of video to sit through first',
      'Expensive and front-loaded',
      'Generic business advice not built for devs'
    ]
  },
  {
    vs: 'Figuring It Out Yourself',
    ours: [
      'Battle-tested task sequence that works',
      'AI does the copy heavy lifting',
      'Know what to do and when',
      'Avoid the most common launch mistakes'
    ],
    other: [
      'Trial and error costs you months',
      'Hours writing copy that doesn\'t convert',
      'Paralysis from too many options',
      'Learn expensive lessons the hard way'
    ]
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
  font-size: clamp(2rem, 5vw, 2.75rem);
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 0.5rem;
  color: var(--cyberpunk-text);
  letter-spacing: -1px;
}

.comparison__grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comparison__card {
  padding: 2rem;
}

.comparison__vs-header {
  margin-bottom: 1.5rem;
}

.comparison__vs-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--cyberpunk-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 0.25rem;
}

.comparison__vs-name {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--cyberpunk-text);
}

.comparison__cols {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: 1.5rem;
  align-items: start;
}

.comparison__divider {
  background: var(--cyberpunk-border);
  height: 100%;
  min-height: 120px;
}

.comparison__col-header {
  margin-bottom: 1rem;
}

.comparison__col-badge {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0.2rem 0.5rem;
}

.comparison__col-badge--ours {
  background: rgba(0, 217, 255, 0.1);
  color: var(--cyberpunk-primary);
  border: 1px solid var(--cyberpunk-primary);
}

.comparison__col-badge--other {
  background: rgba(107, 118, 132, 0.15);
  color: var(--cyberpunk-text-tertiary);
  border: 1px solid var(--cyberpunk-text-tertiary);
}

.comparison__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.comparison__list li {
  font-size: 0.875rem;
  line-height: 1.5;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.comparison__col--ours .comparison__list li {
  color: var(--cyberpunk-text-secondary);
}

.comparison__col--other .comparison__list li {
  color: var(--cyberpunk-text-tertiary);
}

.comparison__icon {
  flex-shrink: 0;
  font-weight: 700;
  font-size: 0.9rem;
}

.comparison__icon--win { color: var(--cyberpunk-primary); }
.comparison__icon--loss { color: var(--cyberpunk-accent); opacity: 0.7; }

@media (max-width: 600px) {
  .comparison__cols {
    grid-template-columns: 1fr;
  }

  .comparison__divider {
    display: none;
  }
}
</style>
