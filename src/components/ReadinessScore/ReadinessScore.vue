<template>
  <div class="score-page">
    <!-- Nav -->
    <header class="score-nav">
      <router-link to="/" class="nav-logo">LAUNCHPILOT</router-link>
      <router-link to="/auth" class="btn-primary" style="padding: 0.5rem 1.25rem; font-size: 0.85rem;">
        Start Free
      </router-link>
    </header>

    <div class="score-container">

      <!-- Quiz View -->
      <div v-if="!showResults" class="quiz-section animate-fade-in-up">
        <div class="quiz-header">
          <h1>Launch Readiness Score</h1>
          <p>Answer 8 quick questions about your app's marketing readiness. Takes 60 seconds.</p>
        </div>

        <!-- Progress Bar -->
        <div class="quiz-progress">
          <div class="quiz-progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
        <div class="quiz-progress-label">
          {{ currentQuestion + 1 }} of {{ questions.length }}
        </div>

        <!-- Current Question -->
        <div class="question-card" :key="currentQuestion">
          <div class="question-number">Q{{ currentQuestion + 1 }}</div>
          <h2 class="question-text">{{ questions[currentQuestion].question }}</h2>
          <p class="question-hint">{{ questions[currentQuestion].hint }}</p>

          <div class="answer-grid">
            <button
              v-for="option in answerOptions"
              :key="option.value"
              class="answer-btn"
              :class="{
                selected: answers[currentQuestion] === option.value,
                'answer-yes': option.value === 'yes',
                'answer-partial': option.value === 'partially',
                'answer-no': option.value === 'no'
              }"
              @click="selectAnswer(option.value)"
            >
              <span class="answer-icon">{{ option.icon }}</span>
              <span class="answer-label">{{ option.label }}</span>
              <span class="answer-points">{{ option.points }} pts</span>
            </button>
          </div>
        </div>

        <!-- Navigation -->
        <div class="quiz-nav">
          <button
            v-if="currentQuestion > 0"
            class="btn-ghost"
            @click="currentQuestion--"
          >
            Previous
          </button>
          <div v-else></div>

          <button
            v-if="currentQuestion < questions.length - 1"
            class="btn-primary"
            :disabled="answers[currentQuestion] === null"
            @click="currentQuestion++"
          >
            Next
          </button>
          <button
            v-else
            class="btn-primary btn-glow"
            :disabled="!allAnswered"
            @click="calculateScore"
          >
            Get My Score
          </button>
        </div>
      </div>

      <!-- Results View -->
      <div v-else class="results-section animate-fade-in-up">
        <!-- Score Display -->
        <div class="score-display" :class="scoreTier.class">
          <div class="score-number-wrap">
            <span class="score-number">{{ animatedScore }}</span>
            <span class="score-max">/100</span>
          </div>
          <div class="score-tier-label">{{ scoreTier.label }}</div>
          <p class="score-tier-desc">{{ scoreTier.description }}</p>
        </div>

        <!-- Gap Cards -->
        <div v-if="gaps.length > 0" class="gaps-section">
          <h2>Your Gaps</h2>
          <p class="gaps-hint">These are the areas that need attention before launch.</p>

          <div class="gap-cards">
            <div
              v-for="gap in gaps"
              :key="gap.taskId"
              class="gap-card"
              :class="{ 'gap-critical': gap.answer === 'no', 'gap-partial': gap.answer === 'partially' }"
            >
              <div class="gap-header">
                <span class="gap-icon">{{ gap.icon }}</span>
                <div>
                  <h3>{{ gap.title }}</h3>
                  <span class="gap-severity">
                    {{ gap.answer === 'no' ? 'Missing' : 'Needs work' }}
                  </span>
                </div>
              </div>
              <p class="gap-fix">{{ gap.fix }}</p>
              <div class="gap-task-link">
                LaunchPilot Task: {{ gap.taskLabel }}
              </div>
            </div>
          </div>
        </div>

        <!-- No Gaps -->
        <div v-else class="no-gaps">
          <h2>You're Ready to Launch!</h2>
          <p>Your marketing foundation looks solid. LaunchPilot can help you optimize and scale what you've built.</p>
        </div>

        <!-- CTAs -->
        <div class="results-cta">
          <router-link to="/auth" class="btn-primary btn-glow btn-large">
            Fix These Gaps Free
          </router-link>
          <button class="btn-ghost" @click="shareScore">
            {{ justCopied ? 'Copied!' : 'Share Your Score' }}
          </button>
          <button class="btn-ghost" @click="retakeQuiz">
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ── Questions ─────────────────────────────────────────────────────────────────
const questions = [
  {
    question: 'Do you have a landing page for your app?',
    hint: 'A dedicated page that explains what your app does and has a clear call-to-action.',
    taskId: 'phase1-1',
    taskLabel: '#1 Landing Page That Converts',
    icon: '🚀',
    title: 'Landing Page',
    fix: 'Build a focused landing page with a one-liner, benefits, and a signup form.'
  },
  {
    question: 'Can people sign up for updates or a waitlist?',
    hint: 'An email capture form, waitlist, or early access signup somewhere on your site.',
    taskId: 'phase1-2',
    taskLabel: '#2 Email Capture & Waitlist',
    icon: '📧',
    title: 'Email Capture',
    fix: 'Set up an email tool (Buttondown, ConvertKit) with a signup incentive and welcome email.'
  },
  {
    question: 'Are you active on social media about your app?',
    hint: 'Posting about your build progress, sharing updates, engaging with your target audience.',
    taskId: 'phase1-3',
    taskLabel: '#3 Social Media Pre-Launch',
    icon: '📱',
    title: 'Social Presence',
    fix: 'Pick 2 platforms, optimize profiles, build a 10-post content bank, and start a daily routine.'
  },
  {
    question: 'Have you prepared for Product Hunt / Indie Hackers / HN?',
    hint: 'Drafted listings, prepared assets, or have a plan for where to announce.',
    taskId: 'phase1-4',
    taskLabel: '#4 PH / IH / HN Launch Prep',
    icon: '🏁',
    title: 'Launch Platform Prep',
    fix: 'Prepare your Product Hunt listing, IH post, and HN submission with assets ready to go.'
  },
  {
    question: 'Do you have analytics and feedback collection set up?',
    hint: 'Web analytics (Plausible/GA), product analytics (PostHog), or a feedback form.',
    taskId: 'phase1-5',
    taskLabel: '#5 Analytics & Feedback Setup',
    icon: '📊',
    title: 'Analytics & Feedback',
    fix: 'Install Plausible for web, PostHog for product analytics, and create a feedback form.'
  },
  {
    question: 'Do you have a launch date set?',
    hint: 'A specific date you\'re working toward, even if it might shift.',
    taskId: 'phase2-6',
    taskLabel: '#6 Launch Day Execution Playbook',
    icon: '📅',
    title: 'Launch Date',
    fix: 'Pick a date, work backwards to create a launch day playbook with hour-by-hour schedule.'
  },
  {
    question: 'Have you written your launch copy and announcement?',
    hint: 'A launch email, social posts, or community announcement drafted and ready.',
    taskId: 'phase2-7',
    taskLabel: '#7 Press & Newsletter Outreach',
    icon: '✍️',
    title: 'Launch Copy',
    fix: 'Write personalized pitches for newsletters and press, prepare a media kit.'
  },
  {
    question: 'Do you know who your target audience is?',
    hint: 'You can describe your ideal user in one sentence — their role, pain, and why they\'d pay.',
    taskId: 'phase3-16',
    taskLabel: '#16 User Interviews & Research',
    icon: '🎯',
    title: 'Target Audience',
    fix: 'Recruit 5 users for interviews, synthesize findings into a clear audience profile.'
  }
]

const answerOptions = [
  { value: 'yes', label: 'Yes', icon: '✅', points: 12.5 },
  { value: 'partially', label: 'Partially', icon: '🟡', points: 6 },
  { value: 'no', label: 'No', icon: '❌', points: 0 }
]

// ── State ─────────────────────────────────────────────────────────────────────
const currentQuestion = ref(0)
const answers = ref(Array(questions.length).fill(null))
const showResults = ref(false)
const animatedScore = ref(0)
const justCopied = ref(false)

// ── Computed ──────────────────────────────────────────────────────────────────
const progressPercent = computed(() =>
  ((currentQuestion.value + 1) / questions.length) * 100
)

const allAnswered = computed(() =>
  answers.value.every(a => a !== null)
)

const totalScore = computed(() => {
  return answers.value.reduce((sum, answer) => {
    const option = answerOptions.find(o => o.value === answer)
    return sum + (option?.points || 0)
  }, 0)
})

const scoreTier = computed(() => {
  const score = Math.round(totalScore.value)
  if (score <= 30) return {
    label: 'Not Launch Ready',
    description: 'You have critical gaps in your marketing foundation. The good news: LaunchPilot walks you through fixing every one of them.',
    class: 'tier-critical'
  }
  if (score <= 60) return {
    label: 'Getting There',
    description: 'You\'ve started but there\'s work to do. Focus on the gaps below to dramatically improve your launch chances.',
    class: 'tier-warning'
  }
  if (score <= 80) return {
    label: 'Almost Ready',
    description: 'Your foundation is solid. A few polish items and you\'re ready to ship.',
    class: 'tier-good'
  }
  return {
    label: 'Launch Ready',
    description: 'Your marketing foundation is strong. LaunchPilot can help you optimize and scale what you\'ve built.',
    class: 'tier-great'
  }
})

const gaps = computed(() => {
  return questions
    .map((q, i) => ({ ...q, answer: answers.value[i] }))
    .filter(q => q.answer !== 'yes')
    .sort((a, b) => (a.answer === 'no' ? -1 : 1))
})

// ── Methods ───────────────────────────────────────────────────────────────────
function selectAnswer(value) {
  answers.value[currentQuestion.value] = value
  // Auto-advance after a short delay
  if (currentQuestion.value < questions.length - 1) {
    setTimeout(() => currentQuestion.value++, 300)
  }
}

function calculateScore() {
  showResults.value = true
  // Animate score counter
  const target = Math.round(totalScore.value)
  animatedScore.value = 0
  const duration = 1200
  const start = performance.now()

  function tick(now) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3)
    animatedScore.value = Math.round(target * eased)
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

async function shareScore() {
  const score = Math.round(totalScore.value)
  const text = `My Launch Readiness Score: ${score}/100 (${scoreTier.value.label})\n\nCheck yours at LaunchPilot: ${window.location.origin}/score`
  try {
    await navigator.clipboard.writeText(text)
    justCopied.value = true
    setTimeout(() => { justCopied.value = false }, 2000)
  } catch {
    // Clipboard API unavailable
  }
}

function retakeQuiz() {
  answers.value = Array(questions.length).fill(null)
  currentQuestion.value = 0
  showResults.value = false
  animatedScore.value = 0
}
</script>

<style scoped>
.score-page {
  min-height: 100vh;
  background: var(--cyberpunk-dark);
  color: var(--cyberpunk-text);
}

/* ── Nav ─────────────────────────────────────────────────────── */
.score-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--cyberpunk-border);
}

.nav-logo {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1rem;
  color: var(--cyberpunk-primary);
  text-decoration: none;
}

/* ── Container ───────────────────────────────────────────────── */
.score-container {
  max-width: 640px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
}

/* ── Quiz ────────────────────────────────────────────────────── */
.quiz-header {
  text-align: center;
  margin-bottom: 2rem;
}

.quiz-header h1 {
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, var(--cyberpunk-primary), var(--cyberpunk-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.quiz-header p {
  color: var(--cyberpunk-text-secondary);
  font-size: 0.9rem;
}

.quiz-progress {
  height: 3px;
  background: var(--cyberpunk-surface);
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.quiz-progress-fill {
  height: 100%;
  background: var(--cyberpunk-primary);
  transition: width 0.3s ease;
  box-shadow: 0 0 8px var(--cyberpunk-primary);
}

.quiz-progress-label {
  text-align: right;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--cyberpunk-text-tertiary);
  margin-bottom: 2rem;
}

/* ── Question Card ───────────────────────────────────────────── */
.question-card {
  animation: fadeInUp 0.3s ease;
}

.question-number {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--cyberpunk-primary);
  letter-spacing: 0.1em;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
}

.question-text {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.question-hint {
  color: var(--cyberpunk-text-secondary);
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

/* ── Answer Buttons ──────────────────────────────────────────── */
.answer-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.answer-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: var(--cyberpunk-surface);
  border: 1px solid var(--cyberpunk-border);
  color: var(--cyberpunk-text);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: var(--font-body);
  font-size: 0.9rem;
  text-align: left;
  width: 100%;
}

.answer-btn:hover {
  border-color: var(--cyberpunk-border-strong);
  background: var(--cyberpunk-surface-light);
}

.answer-btn.selected.answer-yes {
  border-color: #00ff88;
  background: rgba(0, 255, 136, 0.08);
  box-shadow: 0 0 12px rgba(0, 255, 136, 0.1);
}

.answer-btn.selected.answer-partial {
  border-color: var(--cyberpunk-highlight);
  background: rgba(255, 190, 11, 0.08);
  box-shadow: 0 0 12px rgba(255, 190, 11, 0.1);
}

.answer-btn.selected.answer-no {
  border-color: var(--cyberpunk-accent);
  background: rgba(201, 0, 79, 0.08);
  box-shadow: 0 0 12px rgba(201, 0, 79, 0.1);
}

.answer-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.answer-label {
  flex: 1;
  font-weight: 600;
}

.answer-points {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--cyberpunk-text-tertiary);
}

/* ── Quiz Navigation ─────────────────────────────────────────── */
.quiz-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--cyberpunk-border);
}

.btn-glow {
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.3);
}

.btn-glow:hover:not(:disabled) {
  box-shadow: 0 0 30px rgba(0, 217, 255, 0.5), 0 0 60px rgba(0, 217, 255, 0.15);
}

.btn-large {
  padding: 1rem 2.5rem !important;
  font-size: 1rem !important;
}

/* ── Results ─────────────────────────────────────────────────── */
.results-section {
  text-align: center;
}

/* ── Score Display ───────────────────────────────────────────── */
.score-display {
  padding: 3rem 2rem;
  margin-bottom: 3rem;
  border: 1px solid var(--cyberpunk-border);
  background: var(--cyberpunk-surface);
}

.score-number-wrap {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.score-number {
  font-family: var(--font-display);
  font-size: 5rem;
  font-weight: 900;
  line-height: 1;
}

.score-max {
  font-family: var(--font-mono);
  font-size: 1.25rem;
  color: var(--cyberpunk-text-secondary);
}

.score-tier-label {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.score-tier-desc {
  color: var(--cyberpunk-text-secondary);
  font-size: 0.9rem;
  line-height: 1.5;
  max-width: 480px;
  margin: 0 auto;
}

/* Tier colors */
.tier-critical .score-number { color: var(--cyberpunk-accent); text-shadow: 0 0 30px rgba(201, 0, 79, 0.5); }
.tier-critical .score-tier-label { color: var(--cyberpunk-accent); }
.tier-critical { border-color: rgba(201, 0, 79, 0.3); }

.tier-warning .score-number { color: var(--cyberpunk-highlight); text-shadow: 0 0 30px rgba(255, 190, 11, 0.5); }
.tier-warning .score-tier-label { color: var(--cyberpunk-highlight); }
.tier-warning { border-color: rgba(255, 190, 11, 0.3); }

.tier-good .score-number { color: var(--cyberpunk-primary); text-shadow: 0 0 30px rgba(0, 217, 255, 0.5); }
.tier-good .score-tier-label { color: var(--cyberpunk-primary); }
.tier-good { border-color: rgba(0, 217, 255, 0.3); }

.tier-great .score-number { color: #00ff88; text-shadow: 0 0 30px rgba(0, 255, 136, 0.5); }
.tier-great .score-tier-label { color: #00ff88; }
.tier-great { border-color: rgba(0, 255, 136, 0.3); }

/* ── Gaps ────────────────────────────────────────────────────── */
.gaps-section {
  text-align: left;
  margin-bottom: 3rem;
}

.gaps-section h2 {
  font-family: var(--font-display);
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

.gaps-hint {
  color: var(--cyberpunk-text-secondary);
  font-size: 0.85rem;
  margin-bottom: 1.25rem;
}

.gap-cards {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.gap-card {
  background: var(--cyberpunk-surface);
  border: 1px solid var(--cyberpunk-border);
  padding: 1.25rem;
}

.gap-card.gap-critical {
  border-left: 3px solid var(--cyberpunk-accent);
}

.gap-card.gap-partial {
  border-left: 3px solid var(--cyberpunk-highlight);
}

.gap-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.gap-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.gap-header h3 {
  font-size: 0.95rem;
  margin-bottom: 0.125rem;
}

.gap-severity {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.gap-critical .gap-severity { color: var(--cyberpunk-accent); }
.gap-partial .gap-severity { color: var(--cyberpunk-highlight); }

.gap-fix {
  color: var(--cyberpunk-text-secondary);
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

.gap-task-link {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--cyberpunk-primary);
  padding: 0.375rem 0.625rem;
  background: rgba(0, 217, 255, 0.06);
  border: 1px solid rgba(0, 217, 255, 0.15);
  display: inline-block;
}

/* ── No Gaps ─────────────────────────────────────────────────── */
.no-gaps {
  margin-bottom: 3rem;
}

.no-gaps h2 {
  font-family: var(--font-display);
  color: #00ff88;
  margin-bottom: 0.5rem;
}

.no-gaps p {
  color: var(--cyberpunk-text-secondary);
  font-size: 0.9rem;
}

/* ── Results CTAs ────────────────────────────────────────────── */
.results-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

/* ── Animations ──────────────────────────────────────────────── */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── Mobile ──────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .score-container {
    padding: 1.5rem 1rem 3rem;
  }

  .quiz-header h1 {
    font-size: 1.375rem;
  }

  .score-number {
    font-size: 3.5rem;
  }

  .question-text {
    font-size: 1.1rem;
  }
}
</style>
