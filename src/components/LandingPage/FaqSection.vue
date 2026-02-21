<template>
  <section id="faq" class="faq section">
    <div class="section__inner">
      <div class="section__header">
        <span class="badge badge-primary">FAQ</span>
        <h2 class="section__title">Questions devs actually ask.</h2>
      </div>

      <div class="faq__list">
        <div
          v-for="(item, i) in faqs"
          :key="i"
          class="faq__item"
          :class="{ 'faq__item--open': openIndex === i }"
        >
          <button class="faq__question" @click="toggle(i)" :aria-expanded="openIndex === i">
            <span>{{ item.q }}</span>
            <span class="faq__icon" aria-hidden="true">{{ openIndex === i ? '−' : '+' }}</span>
          </button>
          <div class="faq__answer" v-show="openIndex === i">
            <p>{{ item.a }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const openIndex = ref(null)

function toggle(i) {
  openIndex.value = openIndex.value === i ? null : i
}

const faqs = [
  {
    q: 'Do I need to be a marketer to use ShipKit?',
    a: 'No. ShipKit is built by a developer, for developers. Every task is explained in plain English with specific actions, not marketing jargon. The AI handles the copy — you just answer a few questions about your product and it generates everything from your positioning to your launch posts.'
  },
  {
    q: 'What if my app is already launched?',
    a: 'That\'s fine. You can skip Phase 1 tasks you\'ve already done and jump straight into Phases 2–4. ShipKit isn\'t locked to a specific launch timeline — it\'s a system you can use at any stage of your product lifecycle.'
  },
  {
    q: 'Is the $29 really a one-time payment?',
    a: 'Yes. No hidden subscriptions. Pay once, access all 32 tasks forever. Updates to existing tasks are included at no extra cost. The Pro plan ($9/mo) adds monthly new strategies and priority support — but that\'s fully optional.'
  },
  {
    q: 'What tech stack does ShipKit work with?',
    a: 'All of them. ShipKit is about distribution, positioning, and customer acquisition — not code. Whether you built your app in Rails, Next.js, Flutter, or pure PHP, the marketing playbook is the same.'
  },
  {
    q: 'How is this different from just reading blog posts?',
    a: 'Three things: sequence, specificity, and AI execution. Blog posts give you information in random order and you still have to turn it into action. ShipKit gives you tasks in the right sequence, specific to your product, with AI generating the actual copy so you don\'t start from a blank page.'
  },
  {
    q: 'How long does it take to go through the checklist?',
    a: 'Phase 1 typically takes a weekend. Phases 2–4 are ongoing — you run them in parallel with building. Most founders complete their first launch cycle in 4–6 weeks while continuing to build their product.'
  },
  {
    q: 'Can I get a refund if it\'s not for me?',
    a: 'Yes. 30-day money-back guarantee, no questions asked. If ShipKit doesn\'t help you make progress toward paying customers, email us and we\'ll refund you immediately.'
  },
  {
    q: 'What happens after I sign up?',
    a: 'You\'ll create a project for your app, answer a few questions about what you\'re building, and land on your personalized Phase 1 checklist. The first task takes about 15 minutes. ShipKit works best when you do one task per day.'
  }
]
</script>

<style scoped>
.section {
  padding: 6rem 1.5rem;
  background: var(--cyberpunk-dark-secondary);
}

.section__inner {
  max-width: 760px;
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
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  line-height: 1.2;
  color: var(--cyberpunk-text);
  letter-spacing: -1px;
}

.faq__list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.faq__item {
  border-bottom: 1px solid var(--cyberpunk-border);
}

.faq__item:first-child {
  border-top: 1px solid var(--cyberpunk-border);
}

.faq__question {
  width: 100%;
  background: transparent;
  border: none;
  padding: 1.25rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  text-align: left;
  cursor: pointer;
  font-size: 0.975rem;
  font-weight: 600;
  color: var(--cyberpunk-text);
  font-family: var(--font-body);
  transition: color 0.2s;
}

.faq__question:hover {
  color: var(--cyberpunk-primary);
}

.faq__item--open .faq__question {
  color: var(--cyberpunk-primary);
}

.faq__icon {
  flex-shrink: 0;
  font-size: 1.25rem;
  font-weight: 300;
  color: var(--cyberpunk-primary);
  font-family: var(--font-mono);
  width: 20px;
  text-align: center;
}

.faq__answer {
  padding-bottom: 1.25rem;
}

.faq__answer p {
  color: var(--cyberpunk-text-secondary);
  font-size: 0.925rem;
  line-height: 1.7;
  margin: 0;
}
</style>
