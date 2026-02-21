<template>
  <div class="settings-page">
    <div class="settings-header">
      <router-link to="/dashboard" class="back-link">← Back to Dashboard</router-link>
      <h1>Settings</h1>
    </div>

    <div class="settings-sections">

      <!-- Project Details -->
      <section class="settings-section">
        <h2>Project Details</h2>
        <p class="section-desc">Update your app info — this context is used in all AI prompts.</p>

        <form @submit.prevent="saveProjectDetails">
          <div class="form-group">
            <label for="appName">App Name</label>
            <input
              id="appName"
              v-model="projectForm.appName"
              type="text"
              placeholder="My App"
              :disabled="isSavingProject"
            />
          </div>

          <div class="form-group">
            <label for="appDescription">What does your app do?</label>
            <textarea
              id="appDescription"
              v-model="projectForm.appDescription"
              rows="3"
              placeholder="Describe your app..."
              :disabled="isSavingProject"
            />
          </div>

          <div class="form-group">
            <label for="targetAudience">Target audience</label>
            <input
              id="targetAudience"
              v-model="projectForm.targetAudience"
              type="text"
              placeholder="Solo developers building SaaS"
              :disabled="isSavingProject"
            />
          </div>

          <div class="form-group">
            <label for="launchDate">Target launch date</label>
            <input
              id="launchDate"
              v-model="projectForm.launchDate"
              type="date"
              :disabled="isSavingProject"
            />
          </div>

          <div v-if="projectSaveError" class="settings-error">
            {{ projectSaveError }}
          </div>

          <div v-if="projectSaveSuccess" class="settings-success">
            Project details saved.
          </div>

          <button
            type="submit"
            class="btn btn-primary"
            :disabled="isSavingProject"
          >
            {{ isSavingProject ? 'Saving...' : 'Save Changes' }}
          </button>
        </form>
      </section>

      <!-- Account -->
      <section class="settings-section">
        <h2>Account</h2>
        <div class="setting-row">
          <div>
            <strong>Email</strong>
            <p>{{ userEmail }}</p>
          </div>
        </div>
        <div class="setting-row">
          <div>
            <strong>Sign out</strong>
            <p>Sign out of your LaunchPilot account</p>
          </div>
          <button class="btn btn-secondary" @click="handleSignOut">Sign Out</button>
        </div>
      </section>

      <!-- Subscription -->
      <section class="settings-section">
        <h2>Subscription</h2>
        <div class="setting-row">
          <div>
            <strong>Current Plan</strong>
            <p>
              <span class="tier-badge" :class="`tier-${currentTier}`">{{ currentTier }}</span>
            </p>
          </div>
          <button v-if="currentTier === 'free'" class="btn btn-primary">Upgrade</button>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useProjectStore } from '@/stores/projectStore'

const router = useRouter()
const authStore = useAuthStore()
const projectStore = useProjectStore()

const userEmail = computed(() => authStore.user?.email || '')
const currentTier = computed(() => 'free') // Wire to subscription store when implemented

// ── Project form state ────────────────────────────────────────────────────────

const isSavingProject = ref(false)
const projectSaveError = ref('')
const projectSaveSuccess = ref(false)

const projectForm = reactive({
  appName: '',
  appDescription: '',
  targetAudience: '',
  launchDate: ''
})

// Populate form from store when component mounts
onMounted(() => {
  const settings = projectStore.currentProjectSettings
  projectForm.appName = settings?.appName || ''
  projectForm.appDescription = settings?.appDescription || ''
  projectForm.targetAudience = settings?.targetAudience || ''
  projectForm.launchDate = settings?.launchDate || ''
})

const saveProjectDetails = async () => {
  isSavingProject.value = true
  projectSaveError.value = ''
  projectSaveSuccess.value = false

  try {
    // Update project name in the projects table
    if (projectForm.appName && projectForm.appName !== projectStore.currentProject?.name) {
      await projectStore.updateProject({
        name: projectForm.appName,
        description: projectForm.appDescription
      })
    }

    // Update settings in project_data
    await projectStore.updateProjectSettings({
      appName: projectForm.appName,
      appDescription: projectForm.appDescription,
      targetAudience: projectForm.targetAudience,
      launchDate: projectForm.launchDate || null
    })

    projectSaveSuccess.value = true
    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      projectSaveSuccess.value = false
    }, 3000)
  } catch (err) {
    projectSaveError.value = err.message || 'Failed to save. Please try again.'
  } finally {
    isSavingProject.value = false
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────

const handleSignOut = async () => {
  await authStore.handleSignOut()
  router.push('/auth')
}
</script>

<style scoped>
.settings-page {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
}

.back-link {
  color: var(--color-cyan);
  text-decoration: none;
  font-size: 0.875rem;
  display: inline-block;
  margin-bottom: 1rem;
}

.settings-page h1 {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.settings-section {
  margin-bottom: 2.5rem;
}

.settings-section h2 {
  font-size: 1rem;
  font-weight: 600;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 0.75rem;
}

.section-desc {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  margin-bottom: 1.25rem;
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

.settings-error {
  background: rgba(201, 0, 79, 0.1);
  border: 1px solid var(--color-magenta);
  color: var(--color-magenta);
  padding: 0.75rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.settings-success {
  background: rgba(0, 217, 255, 0.08);
  border: 1px solid var(--color-cyan);
  color: var(--color-cyan);
  padding: 0.75rem;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}

.setting-row strong {
  font-size: 0.875rem;
}

.setting-row p {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  margin-top: 0.125rem;
}

.tier-badge {
  text-transform: uppercase;
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.tier-free { color: var(--color-cyan); }
.tier-launcher { color: var(--color-yellow); }
.tier-pro { color: var(--color-magenta); }
</style>
