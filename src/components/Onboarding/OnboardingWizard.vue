<template>
  <div class="onboarding">
    <div class="onboarding-card">
      <div class="onboarding-brand">
        <span class="onboarding-brand-text">LaunchPilot</span>
      </div>

      <h1>Set Up Your Project</h1>
      <p class="onboarding-subtitle">Tell us about your app so we can personalize your launch tasks.</p>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="appName">App Name</label>
          <input
            id="appName"
            v-model="form.appName"
            type="text"
            placeholder="LaunchPilot"
            required
            :disabled="isSaving"
          />
        </div>

        <div class="form-group">
          <label for="appDescription">What does your app do?</label>
          <textarea
            id="appDescription"
            v-model="form.appDescription"
            placeholder="A guided launch checklist for indie developers..."
            rows="3"
            required
            :disabled="isSaving"
          />
        </div>

        <div class="form-group">
          <label for="targetAudience">Who is your target user?</label>
          <input
            id="targetAudience"
            v-model="form.targetAudience"
            type="text"
            placeholder="Solo developers building SaaS"
            required
            :disabled="isSaving"
          />
        </div>

        <div class="form-group">
          <label for="launchDate">Target launch date (optional)</label>
          <input
            id="launchDate"
            v-model="form.launchDate"
            type="date"
            :disabled="isSaving"
          />
        </div>

        <div v-if="saveError" class="onboarding-error">
          {{ saveError }}
        </div>

        <button type="submit" class="btn btn-primary" style="width: 100%;" :disabled="isSaving">
          {{ isSaving ? 'Saving...' : 'Start Your Launch Journey' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectStore } from '@/stores/projectStore'

const router = useRouter()
const projectStore = useProjectStore()

const isSaving = ref(false)
const saveError = ref('')

const form = reactive({
  appName: '',
  appDescription: '',
  targetAudience: '',
  launchDate: ''
})

const handleSubmit = async () => {
  isSaving.value = true
  saveError.value = ''

  try {
    // Create the project in Supabase using the app name and description
    const project = await projectStore.createProject(form.appName, form.appDescription)

    // Save the full onboarding settings to project_data
    await projectStore.updateProjectSettings({
      appName: form.appName,
      appDescription: form.appDescription,
      targetAudience: form.targetAudience,
      launchDate: form.launchDate || null
    })

    // Navigate to dashboard — project is now loaded in the store
    router.push('/dashboard')
  } catch (err) {
    saveError.value = err.message || 'Failed to save project. Please try again.'
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.onboarding {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.onboarding-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 2.5rem;
  max-width: 500px;
  width: 100%;
}

.onboarding-brand {
  margin-bottom: 1.5rem;
}

.onboarding-brand-text {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-cyan);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.onboarding-card h1 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.onboarding-subtitle {
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.375rem;
  color: var(--color-text);
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.625rem 0.75rem;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-family: inherit;
  font-size: 0.875rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-cyan);
  box-shadow: 0 0 0 1px var(--color-cyan);
}

.form-group input:disabled,
.form-group textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.onboarding-error {
  background: rgba(201, 0, 79, 0.1);
  border: 1px solid var(--color-magenta);
  color: var(--color-magenta);
  padding: 0.75rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}
</style>
