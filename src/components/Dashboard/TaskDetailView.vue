<template>
  <div class="task-detail">
    <!-- Unsaved Changes Warning Dialog -->
    <div v-if="showUnsavedWarning" class="unsaved-overlay">
      <div class="unsaved-dialog">
        <h3>Unsaved Changes</h3>
        <p>You have unsaved changes. If you leave now, your input will be lost.</p>
        <div class="unsaved-actions">
          <button class="btn-secondary" @click="cancelNavigation">Keep Editing</button>
          <button class="btn-accent" @click="confirmDiscard">Discard & Leave</button>
        </div>
      </div>
    </div>

    <div class="task-header">
      <a class="back-link" @click.prevent="handleBackClick" href="/dashboard">← Back to Dashboard</a>
      <div v-if="task" class="task-title-bar">
        <span class="task-icon">{{ task.icon }}</span>
        <div>
          <h1>{{ task.title }}</h1>
          <p class="task-meta">
            Phase {{ task.phase }}: {{ task.phaseLabel }} · {{ task.timeEstimate }} ·
            <span class="tier-badge" :class="`tier-${task.tier}`">{{ task.tier }}</span>
          </p>
        </div>
      </div>

      <!-- Save Status Indicator -->
      <div v-if="task && task.formFields?.length" class="save-status">
        <span v-if="isSaving" class="save-indicator saving">Saving...</span>
        <span v-else-if="saveError" class="save-indicator error" :title="saveError">Save failed</span>
        <span v-else-if="lastSaveTime" class="save-indicator saved">Saved</span>
      </div>
    </div>

    <div v-if="task" class="task-body">
      <p class="task-description">{{ task.description }}</p>

      <!-- Steps (interactive with subtask checkboxes) -->
      <section class="task-section">
        <h2>Steps</h2>
        <div v-for="(step, i) in task.steps" :key="i" class="step-card">
          <div class="step-header">
            <h3>{{ i + 1 }}. {{ step.title }}</h3>
            <span v-if="step.subtasks?.length" class="step-progress">
              {{ getCheckedCount(i) }}/{{ step.subtasks.length }} done
            </span>
          </div>
          <p>{{ step.description }}</p>
          <ul v-if="step.subtasks?.length" class="subtask-list">
            <li
              v-for="(sub, j) in step.subtasks"
              :key="j"
              class="subtask-item"
              :class="{ completed: subtaskState[`${i}-${j}`] }"
              @click="toggleSubtask(i, j)"
            >
              <span class="subtask-checkbox">
                <span v-if="subtaskState[`${i}-${j}`]" class="check-icon">✓</span>
              </span>
              <span class="subtask-content">
                <strong>{{ sub.title }}</strong> — {{ sub.description }}
              </span>
            </li>
          </ul>
          <!-- Step progress bar -->
          <div v-if="step.subtasks?.length" class="step-progress-bar">
            <div
              class="step-progress-fill"
              :style="{ width: `${(getCheckedCount(i) / step.subtasks.length) * 100}%` }"
            ></div>
          </div>
        </div>
      </section>

      <!-- Form Fields (Your Input section) -->
      <section v-if="task.formFields?.length" class="task-section workbench-section">
        <h2>Your Input</h2>
        <p class="section-hint">Fill in the fields below — your answers are saved automatically and used to generate AI content.</p>

        <div class="form-fields">
          <div
            v-for="field in task.formFields"
            :key="field.id"
            class="form-field"
          >
            <label :for="`field-${field.id}`" class="field-label">
              {{ field.label }}
              <span v-if="field.required" class="required-mark">*</span>
            </label>

            <!-- Text input -->
            <input
              v-if="field.type === 'text'"
              :id="`field-${field.id}`"
              type="text"
              class="field-input"
              :placeholder="field.placeholder"
              :value="formData[field.id] || ''"
              @input="handleFieldInput(field.id, $event.target.value)"
            />

            <!-- Textarea -->
            <textarea
              v-else-if="field.type === 'textarea'"
              :id="`field-${field.id}`"
              class="field-textarea"
              :placeholder="field.placeholder"
              rows="4"
              :value="formData[field.id] || ''"
              @input="handleFieldInput(field.id, $event.target.value)"
            ></textarea>

            <!-- Select -->
            <select
              v-else-if="field.type === 'select'"
              :id="`field-${field.id}`"
              class="field-select"
              :value="formData[field.id] || ''"
              @change="handleFieldInput(field.id, $event.target.value)"
            >
              <option value="" disabled>Choose an option...</option>
              <option
                v-for="opt in field.options"
                :key="opt.value"
                :value="opt.value"
              >{{ opt.label }}</option>
            </select>

            <!-- Checkboxes -->
            <div v-else-if="field.type === 'checkboxes'" class="field-checkboxes">
              <label
                v-for="opt in field.options"
                :key="opt.value"
                class="checkbox-item"
              >
                <input
                  type="checkbox"
                  :value="opt.value"
                  :checked="(formData[field.id] || []).includes(opt.value)"
                  @change="handleCheckboxChange(field.id, opt.value, $event.target.checked)"
                />
                <span class="checkbox-label">{{ opt.label }}</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      <!-- AI Generation Panel -->
      <section v-if="task.aiConfig" class="task-section workbench-section ai-section">
        <h2>Generate with AI</h2>

        <div class="ai-panel">
          <p class="ai-description">
            Let AI generate customized content based on your input above.
            <span v-if="!allRequiredFilled" class="ai-hint">Fill in all required fields (*) to enable generation.</span>
          </p>

          <button
            class="btn-generate"
            :disabled="!allRequiredFilled || isGenerating"
            @click="handleGenerate"
          >
            <span v-if="isGenerating" class="generating-dots">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            </span>
            <span v-else>Generate Content</span>
          </button>

          <!-- AI Error -->
          <div v-if="aiError" class="ai-error">
            <strong>Generation failed:</strong> {{ aiError }}
          </div>

          <!-- AI Output -->
          <div v-if="aiOutput" class="ai-output">
            <div class="ai-output-header">
              <span class="ai-output-label">AI Generated Content</span>
              <div class="ai-output-actions">
                <button class="btn-small btn-copy" @click="copyOutput" :class="{ copied: justCopied }">
                  {{ justCopied ? 'Copied!' : 'Copy' }}
                </button>
                <button class="btn-small btn-regenerate" @click="handleGenerate" :disabled="isGenerating">
                  Regenerate
                </button>
                <button class="btn-small btn-save-item" @click="saveAIOutput">
                  Save
                </button>
              </div>
            </div>
            <div class="ai-output-content" v-html="renderMarkdown(aiOutput)"></div>
          </div>
        </div>
      </section>

      <!-- Saved AI Items -->
      <section v-if="savedItems.length > 0" class="task-section">
        <h2>Saved Results</h2>
        <div class="saved-items">
          <div v-for="(item, i) in savedItems" :key="i" class="saved-item">
            <div class="saved-item-header">
              <span class="saved-item-time">{{ formatDate(item.timestamp) }}</span>
              <button class="btn-small btn-remove" @click="removeSavedItem(i)">Remove</button>
            </div>
            <div class="saved-item-content" v-html="renderMarkdown(item.content)"></div>
          </div>
        </div>
      </section>

      <!-- Templates (with copy buttons) -->
      <section v-if="task.templates?.length" class="task-section">
        <h2>Templates</h2>
        <div v-for="(tpl, i) in task.templates" :key="i" class="template-card">
          <div class="template-header">
            <h3>{{ tpl.title }}</h3>
            <button
              class="btn-small btn-copy"
              :class="{ copied: copiedTemplate === i }"
              @click="copyTemplate(tpl.content, i)"
            >
              {{ copiedTemplate === i ? 'Copied!' : 'Copy' }}
            </button>
          </div>
          <pre class="template-content">{{ tpl.content }}</pre>
        </div>
      </section>

      <!-- Tools -->
      <section v-if="task.tools?.length" class="task-section">
        <h2>Recommended Tools</h2>
        <div v-for="(tool, i) in task.tools" :key="i" class="tool-card">
          <a :href="tool.url" target="_blank" rel="noopener">{{ tool.name }}</a>
          <p>{{ tool.freeDetails }}</p>
        </div>
      </section>

      <!-- Done Criteria -->
      <section v-if="task.doneCriteria?.length" class="task-section">
        <h2>Done Criteria</h2>
        <ul class="checklist">
          <li v-for="(item, i) in task.doneCriteria" :key="i">{{ item }}</li>
        </ul>
      </section>
    </div>

    <div v-else class="task-not-found">
      <h2>Task not found</h2>
      <p>No task found with ID "{{ taskId }}".</p>
      <router-link to="/dashboard" class="btn btn-primary">Back to Dashboard</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { findTask } from '@/tasks/index.js'
import { generateAIContent } from '@/services/aiGeneration.js'
import { useTaskFormData } from '@/composables/useTaskFormData.js'
import { useUnsavedChanges } from '@/composables/useUnsavedChanges.js'
import { useProjectStore } from '@/stores/projectStore.js'

const props = defineProps({
  taskId: { type: String, required: true }
})

const router = useRouter()
const projectStore = useProjectStore()

const task = computed(() => findTask(props.taskId))

// ── Project context ──────────────────────────────────────────────────────────
const projectId = computed(() => projectStore.currentProjectId)

// ── Form data composable ─────────────────────────────────────────────────────
const {
  formData,
  savedItems,
  isSaving,
  error: saveError,
  lastSaveTime,
  isDirty,
  updateField,
  addSavedItem,
  removeSavedItem
} = useTaskFormData(projectId.value, props.taskId)

// ── Unsaved changes guard ────────────────────────────────────────────────────
const {
  showUnsavedWarning,
  requestNavigation,
  confirmDiscard,
  cancelNavigation,
  markDirty,
  markClean,
  updateSavedState
} = useUnsavedChanges()

// Sync isDirty from form composable into unsaved changes guard
watch(isDirty, (dirty) => {
  if (dirty) markDirty()
  else markClean()
})

// Sync after successful save
watch(lastSaveTime, (time) => {
  if (time) updateSavedState(formData.value)
})

function handleBackClick() {
  requestNavigation(() => {
    router.push('/dashboard')
  })
}

// ── Subtask checkbox state ───────────────────────────────────────────────────
// Key format: `${stepIndex}-${subtaskIndex}`
// Persisted as a special form field `_subtaskState` via useTaskFormData
const subtaskState = reactive({})

// Restore subtask state from saved form data on load
watch(() => formData.value._subtaskState, (saved) => {
  if (saved && typeof saved === 'object') {
    Object.assign(subtaskState, saved)
  }
}, { immediate: true })

function getCheckedCount(stepIndex) {
  const step = task.value?.steps?.[stepIndex]
  if (!step?.subtasks?.length) return 0
  return step.subtasks.filter((_, j) => subtaskState[`${stepIndex}-${j}`]).length
}

function toggleSubtask(stepIndex, subtaskIndex) {
  const key = `${stepIndex}-${subtaskIndex}`
  subtaskState[key] = !subtaskState[key]
  // Persist the entire subtask state as a form field
  updateField('_subtaskState', { ...subtaskState })
}

// ── Form field handlers ──────────────────────────────────────────────────────
function handleFieldInput(fieldId, value) {
  updateField(fieldId, value)
}

function handleCheckboxChange(fieldId, optionValue, checked) {
  const current = Array.isArray(formData.value[fieldId]) ? [...formData.value[fieldId]] : []
  if (checked) {
    if (!current.includes(optionValue)) current.push(optionValue)
  } else {
    const idx = current.indexOf(optionValue)
    if (idx > -1) current.splice(idx, 1)
  }
  updateField(fieldId, current)
}

// ── Required fields validation ───────────────────────────────────────────────
const allRequiredFilled = computed(() => {
  if (!task.value?.formFields?.length) return true
  return task.value.formFields
    .filter(f => f.required)
    .every(f => {
      const val = formData.value[f.id]
      if (Array.isArray(val)) return val.length > 0
      return val && String(val).trim().length > 0
    })
})

// ── AI Generation ────────────────────────────────────────────────────────────
const isGenerating = ref(false)
const aiOutput = ref('')
const aiError = ref('')
const justCopied = ref(false)

async function handleGenerate() {
  if (!task.value?.aiConfig || !allRequiredFilled.value) return
  isGenerating.value = true
  aiError.value = ''

  try {
    const result = await generateAIContent(task.value, formData.value)
    aiOutput.value = typeof result === 'string' ? result : JSON.stringify(result, null, 2)
  } catch (err) {
    aiError.value = err.message || 'Something went wrong. Please try again.'
  } finally {
    isGenerating.value = false
  }
}

async function copyOutput() {
  if (!aiOutput.value) return
  try {
    await navigator.clipboard.writeText(aiOutput.value)
    justCopied.value = true
    setTimeout(() => { justCopied.value = false }, 2000)
  } catch {
    // Clipboard API unavailable — silently fail
  }
}

function saveAIOutput() {
  if (!aiOutput.value) return
  addSavedItem({
    content: aiOutput.value,
    taskId: props.taskId
  })
}

// ── Template copy ────────────────────────────────────────────────────────────
const copiedTemplate = ref(null)

async function copyTemplate(content, index) {
  try {
    await navigator.clipboard.writeText(content)
    copiedTemplate.value = index
    setTimeout(() => { copiedTemplate.value = null }, 2000)
  } catch {
    // Clipboard API unavailable — silently fail
  }
}

// ── Markdown renderer (lightweight, no deps) ─────────────────────────────────
function renderMarkdown(text) {
  if (!text) return ''
  return text
    // Escape HTML to prevent XSS
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(/^### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Bullet points (→ and -)
    .replace(/^→ (.+)$/gm, '<li class="bullet-item">$1</li>')
    .replace(/^- (.+)$/gm, '<li class="bullet-item">$1</li>')
    // Wrap consecutive li in ul
    .replace(/(<li class="bullet-item">.*<\/li>\n?)+/g, (match) => `<ul class="md-list">${match}</ul>`)
    // Paragraphs (double newlines)
    .replace(/\n\n/g, '</p><p>')
    // Single line breaks in paragraphs
    .replace(/\n/g, '<br>')
    // Wrap in paragraph if not already wrapped
    .replace(/^(?!<[hul])(.+)/, '<p>$1')
    .replace(/([^>])$/, '$1</p>')
}

// ── Date formatter ────────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return ''
  }
}
</script>

<style scoped>
.task-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

/* ── Unsaved changes dialog ──────────────────────────────────────── */
.unsaved-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 14, 39, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.unsaved-dialog {
  background: var(--color-surface);
  border: 1px solid var(--color-magenta);
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 0 30px rgba(201, 0, 79, 0.3);
}

.unsaved-dialog h3 {
  color: var(--color-magenta);
  margin-bottom: 0.75rem;
  font-size: 1.125rem;
}

.unsaved-dialog p {
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
}

.unsaved-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

/* ── Header ──────────────────────────────────────────────────────── */
.task-header {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.back-link {
  color: var(--color-cyan);
  text-decoration: none;
  font-size: 0.875rem;
  display: inline-block;
  cursor: pointer;
  transition: opacity 0.2s;
}

.back-link:hover {
  opacity: 0.8;
}

.task-title-bar {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.task-icon {
  font-size: 2rem;
  line-height: 1;
}

.task-title-bar h1 {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
}

.task-meta {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
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

/* ── Save status ─────────────────────────────────────────────────── */
.save-status {
  display: flex;
  align-items: center;
}

.save-indicator {
  font-size: 0.75rem;
  font-family: var(--font-mono);
  padding: 0.25rem 0.625rem;
  border: 1px solid;
}

.save-indicator.saving {
  color: var(--color-yellow);
  border-color: rgba(255, 190, 11, 0.3);
  background: rgba(255, 190, 11, 0.05);
  animation: pulse 1.2s ease-in-out infinite;
}

.save-indicator.saved {
  color: var(--color-cyan);
  border-color: rgba(0, 217, 255, 0.3);
  background: rgba(0, 217, 255, 0.05);
}

.save-indicator.error {
  color: var(--color-magenta);
  border-color: rgba(201, 0, 79, 0.3);
  background: rgba(201, 0, 79, 0.05);
  cursor: help;
}

/* ── Body ────────────────────────────────────────────────────────── */
.task-description {
  margin: 1.5rem 0;
  color: var(--color-text-secondary);
  line-height: 1.6;
}

.task-section {
  margin-bottom: 2.5rem;
}

.task-section h2 {
  font-size: 1.125rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

/* ── Workbench section highlight ─────────────────────────────────── */
.workbench-section {
  border: 1px solid var(--color-border);
  padding: 1.5rem;
  background: rgba(0, 217, 255, 0.02);
}

.workbench-section h2 {
  border-bottom-color: rgba(0, 217, 255, 0.3);
  color: var(--color-cyan);
}

.section-hint {
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
  margin-bottom: 1.25rem;
  line-height: 1.5;
}

/* ── Steps ───────────────────────────────────────────────────────── */
.step-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 1.25rem;
  margin-bottom: 0.75rem;
}

.step-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.step-header h3 {
  font-size: 1rem;
}

.step-progress {
  font-size: 0.75rem;
  font-family: var(--font-mono);
  color: var(--color-cyan);
  background: rgba(0, 217, 255, 0.1);
  padding: 0.2rem 0.5rem;
  border: 1px solid rgba(0, 217, 255, 0.2);
}

.step-card p {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

.subtask-list {
  list-style: none;
  padding: 0;
  margin-top: 0.75rem;
}

.subtask-item {
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  padding: 0.5rem 0;
  border-top: 1px solid var(--color-border);
  cursor: pointer;
  transition: background 0.15s;
  user-select: none;
}

.subtask-item:hover {
  background: rgba(0, 217, 255, 0.04);
}

.subtask-item.completed .subtask-content {
  opacity: 0.5;
  text-decoration: line-through;
}

.subtask-checkbox {
  flex-shrink: 0;
  width: 1.125rem;
  height: 1.125rem;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.125rem;
  transition: border-color 0.15s, background 0.15s;
}

.subtask-item.completed .subtask-checkbox {
  background: var(--color-cyan);
  border-color: var(--color-cyan);
}

.check-icon {
  color: var(--color-bg);
  font-size: 0.6875rem;
  font-weight: 700;
  line-height: 1;
}

.subtask-content {
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  line-height: 1.45;
  transition: opacity 0.15s;
}

.subtask-content strong {
  color: var(--color-text);
}

.step-progress-bar {
  height: 2px;
  background: var(--color-border);
  margin-top: 0.75rem;
  overflow: hidden;
}

.step-progress-fill {
  height: 100%;
  background: var(--color-cyan);
  transition: width 0.3s ease;
  box-shadow: 0 0 6px var(--color-cyan);
}

/* ── Form fields ─────────────────────────────────────────────────── */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text);
}

.required-mark {
  color: var(--color-cyan);
  margin-left: 0.2rem;
}

.field-input,
.field-textarea,
.field-select {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 0.875rem;
  padding: 0.625rem 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  width: 100%;
}

.field-input:focus,
.field-textarea:focus,
.field-select:focus {
  outline: none;
  border-color: var(--color-cyan);
  box-shadow: 0 0 0 1px rgba(0, 217, 255, 0.2), 0 0 8px rgba(0, 217, 255, 0.1);
}

.field-input::placeholder,
.field-textarea::placeholder {
  color: var(--color-text-secondary);
  opacity: 0.6;
}

.field-textarea {
  resize: vertical;
  min-height: 7rem;
  line-height: 1.5;
}

.field-select {
  cursor: pointer;
}

.field-select option {
  background: var(--color-surface);
  color: var(--color-text);
}

.field-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  accent-color: var(--color-cyan);
  cursor: pointer;
}

.checkbox-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

/* ── AI section ──────────────────────────────────────────────────── */
.ai-section {
  background: rgba(0, 217, 255, 0.03);
  border-color: rgba(0, 217, 255, 0.25);
}

.ai-panel {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.ai-description {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
}

.ai-hint {
  color: var(--color-yellow);
  margin-left: 0.25rem;
}

.btn-generate {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--color-cyan);
  color: var(--color-bg);
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 0.9375rem;
  letter-spacing: 0.03em;
  padding: 0.875rem 2rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  align-self: flex-start;
  box-shadow: 0 0 16px rgba(0, 217, 255, 0.2);
}

.btn-generate:hover:not(:disabled) {
  background: var(--color-cyan);
  box-shadow: 0 0 28px rgba(0, 217, 255, 0.5), 0 0 60px rgba(0, 217, 255, 0.15);
  transform: translateY(-1px);
}

.btn-generate:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}

/* Pulsing dots for loading state */
.generating-dots {
  display: flex;
  gap: 0.3rem;
  align-items: center;
}

.dot {
  width: 6px;
  height: 6px;
  background: var(--color-bg);
  animation: bounce 1.1s ease-in-out infinite;
}

.dot:nth-child(2) { animation-delay: 0.2s; }
.dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

/* ── AI Error ────────────────────────────────────────────────────── */
.ai-error {
  background: rgba(201, 0, 79, 0.08);
  border: 1px solid rgba(201, 0, 79, 0.35);
  color: var(--color-magenta);
  padding: 0.875rem 1rem;
  font-size: 0.8125rem;
  line-height: 1.5;
}

/* ── AI Output ───────────────────────────────────────────────────── */
.ai-output {
  border: 1px solid rgba(0, 217, 255, 0.35);
  background: rgba(0, 217, 255, 0.04);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.05);
}

.ai-output-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(0, 217, 255, 0.2);
  background: rgba(0, 217, 255, 0.06);
}

.ai-output-label {
  font-size: 0.75rem;
  font-family: var(--font-mono);
  color: var(--color-cyan);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.ai-output-actions {
  display: flex;
  gap: 0.5rem;
}

.ai-output-content {
  padding: 1.25rem;
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--color-text);
}

/* Markdown rendering inside ai-output-content and saved-item-content */
.ai-output-content :deep(h2),
.saved-item-content :deep(h2) {
  font-size: 1.0625rem;
  margin: 1.25rem 0 0.5rem;
  color: var(--color-cyan);
}

.ai-output-content :deep(h3),
.saved-item-content :deep(h3) {
  font-size: 0.9375rem;
  margin: 1rem 0 0.375rem;
  color: var(--color-yellow);
}

.ai-output-content :deep(h4),
.saved-item-content :deep(h4) {
  font-size: 0.875rem;
  margin: 0.875rem 0 0.375rem;
  color: var(--color-text);
}

.ai-output-content :deep(p),
.saved-item-content :deep(p) {
  margin: 0 0 0.75rem;
}

.ai-output-content :deep(.md-list),
.saved-item-content :deep(.md-list) {
  list-style: none;
  padding: 0;
  margin: 0.375rem 0 0.75rem;
}

.ai-output-content :deep(.bullet-item),
.saved-item-content :deep(.bullet-item) {
  padding: 0.25rem 0 0.25rem 1.25rem;
  position: relative;
  color: var(--color-text-secondary);
}

.ai-output-content :deep(.bullet-item)::before,
.saved-item-content :deep(.bullet-item)::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--color-cyan);
}

.ai-output-content :deep(strong),
.saved-item-content :deep(strong) {
  color: var(--color-text);
}

/* ── Small buttons ───────────────────────────────────────────────── */
.btn-small {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.75rem;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.15s;
  background: transparent;
}

.btn-copy {
  color: var(--color-cyan);
  border-color: rgba(0, 217, 255, 0.35);
}

.btn-copy:hover:not(:disabled) {
  background: rgba(0, 217, 255, 0.1);
}

.btn-copy.copied {
  color: var(--color-yellow);
  border-color: rgba(255, 190, 11, 0.35);
  background: rgba(255, 190, 11, 0.08);
}

.btn-regenerate {
  color: var(--color-text-secondary);
  border-color: var(--color-border);
}

.btn-regenerate:hover:not(:disabled) {
  color: var(--color-text);
  border-color: var(--color-cyan);
}

.btn-save-item {
  color: var(--color-yellow);
  border-color: rgba(255, 190, 11, 0.35);
}

.btn-save-item:hover {
  background: rgba(255, 190, 11, 0.08);
}

.btn-remove {
  color: var(--color-magenta);
  border-color: rgba(201, 0, 79, 0.3);
}

.btn-remove:hover {
  background: rgba(201, 0, 79, 0.08);
}

/* ── Saved items ─────────────────────────────────────────────────── */
.saved-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.saved-item {
  border: 1px solid var(--color-border);
  background: var(--color-surface);
}

.saved-item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 1rem;
  border-bottom: 1px solid var(--color-border);
  background: rgba(255, 255, 255, 0.02);
}

.saved-item-time {
  font-size: 0.75rem;
  font-family: var(--font-mono);
  color: var(--color-text-secondary);
}

.saved-item-content {
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.65;
}

/* ── Templates ───────────────────────────────────────────────────── */
.template-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 1.25rem;
  margin-bottom: 0.75rem;
}

.template-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.template-header h3 {
  font-size: 0.875rem;
}

.template-content {
  background: var(--color-bg);
  padding: 1rem;
  font-size: 0.8125rem;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.5;
  border: 1px solid var(--color-border);
  overflow-x: auto;
}

/* ── Tools ───────────────────────────────────────────────────────── */
.tool-card {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}

.tool-card a {
  color: var(--color-cyan);
  font-weight: 600;
}

.tool-card p {
  color: var(--color-text-secondary);
  font-size: 0.8125rem;
  margin-top: 0.25rem;
}

/* ── Done criteria ───────────────────────────────────────────────── */
.checklist {
  list-style: none;
  padding: 0;
}

.checklist li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
  font-size: 0.875rem;
  border-bottom: 1px solid var(--color-border);
}

.checklist li::before {
  content: '☐';
  position: absolute;
  left: 0;
}

/* ── Not found ───────────────────────────────────────────────────── */
.task-not-found {
  text-align: center;
  padding: 4rem 2rem;
}

/* ── Animations ──────────────────────────────────────────────────── */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* ── Button base shared styles ───────────────────────────────────── */
.btn-secondary {
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  padding: 0.625rem 1.25rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  color: var(--color-text);
  border-color: var(--color-cyan);
}

.btn-accent {
  background: var(--color-magenta);
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-accent:hover {
  box-shadow: 0 0 16px rgba(201, 0, 79, 0.4);
}

/* ── Mobile ──────────────────────────────────────────────────────── */
@media (max-width: 640px) {
  .task-detail {
    padding: 1rem;
  }

  .ai-output-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.625rem;
  }

  .btn-generate {
    width: 100%;
    justify-content: center;
  }

  .template-header {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}
</style>
