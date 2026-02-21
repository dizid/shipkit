<template>
  <div class="min-h-screen" style="background: var(--cyberpunk-dark);">

    <!-- Top Header Bar -->
    <header
      class="flex-between px-4 py-3"
      style="background: var(--cyberpunk-surface); border-bottom: 1px solid var(--cyberpunk-border); position: sticky; top: 0; z-index: 10;"
    >
      <div class="flex items-center gap-3">
        <span style="font-family: var(--font-display); font-size: 1rem; font-weight: 700; color: var(--cyberpunk-primary);">SHIPKIT</span>
        <span class="badge badge-highlight" style="font-size: 0.65rem;">BETA</span>
      </div>
      <div class="flex items-center gap-4">
        <span style="color: var(--cyberpunk-text-secondary); font-size: 0.85rem;">
          {{ userEmail }}
        </span>
        <button @click="handleSignOut" class="btn-ghost" style="padding: 0.375rem 0.75rem; font-size: 0.8rem;">
          Sign Out
        </button>
      </div>
    </header>

    <div class="px-4 py-6 max-w-4xl mx-auto">

      <!-- User Greeting -->
      <div class="mb-8 animate-fade-in-up">
        <h1 class="text-2xl font-bold mb-1" style="font-family: var(--font-display); color: var(--cyberpunk-text);">
          Ready to ship, <span style="color: var(--cyberpunk-primary);">{{ userFirstName }}</span>
        </h1>
        <p style="color: var(--cyberpunk-text-secondary); font-size: 0.9rem;">
          {{ totalCompleted }} of {{ totalTasks }} tasks complete &mdash; {{ overallProgressPercent }}% to launch
        </p>
      </div>

      <!-- Overall Progress Bar -->
      <div class="mb-8">
        <div
          style="height: 4px; background: var(--cyberpunk-surface); border: 1px solid var(--cyberpunk-border); position: relative; overflow: hidden;"
        >
          <div
            style="height: 100%; background: var(--cyberpunk-primary); transition: width 0.5s ease;"
            :style="{ width: overallProgressPercent + '%' }"
          ></div>
        </div>
      </div>

      <!-- Phase Overview Grid -->
      <div class="grid grid-cols-2 gap-3 mb-8 md:grid-cols-4">
        <button
          v-for="phase in phases"
          :key="phase.id"
          @click="selectPhase(phase.id)"
          class="text-left p-4"
          :style="{
            background: selectedPhase === phase.id ? 'var(--cyberpunk-surface-light)' : 'var(--cyberpunk-surface)',
            border: selectedPhase === phase.id ? '1px solid var(--cyberpunk-primary)' : '1px solid var(--cyberpunk-border)',
            boxShadow: selectedPhase === phase.id ? '0 0 16px rgba(0, 217, 255, 0.15)' : 'none',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            width: '100%',
          }"
        >
          <!-- Phase Label -->
          <div
            class="text-xs font-semibold mb-2"
            style="font-family: var(--font-mono); letter-spacing: 0.5px; text-transform: uppercase;"
            :style="{ color: phase.color }"
          >
            Phase {{ phase.id }}
          </div>

          <!-- Phase Title -->
          <div class="text-sm font-semibold mb-3" style="color: var(--cyberpunk-text); line-height: 1.3;">
            {{ phase.title }}
          </div>

          <!-- Progress -->
          <div
            class="text-xs mb-2"
            style="font-family: var(--font-mono); color: var(--cyberpunk-text-secondary);"
          >
            {{ phaseCompleted(phase) }}/{{ phase.tasks.length }} tasks
          </div>

          <!-- Mini progress bar -->
          <div style="height: 3px; background: var(--cyberpunk-dark); overflow: hidden;">
            <div
              style="height: 100%; transition: width 0.5s ease;"
              :style="{
                width: phaseProgress(phase) + '%',
                background: phase.color
              }"
            ></div>
          </div>
        </button>
      </div>

      <!-- Task List for Selected Phase -->
      <div v-if="activePhase" class="animate-fade-in">

        <!-- Phase Header -->
        <div
          class="flex-between mb-4 pb-3"
          style="border-bottom: 1px solid var(--cyberpunk-border);"
        >
          <div>
            <h2 class="text-lg font-bold" style="font-family: var(--font-display); color: var(--cyberpunk-text);">
              Phase {{ activePhase.id }}: {{ activePhase.title }}
            </h2>
            <p style="color: var(--cyberpunk-text-secondary); font-size: 0.85rem; margin-top: 0.25rem;">
              {{ activePhase.description }}
            </p>
          </div>
          <span class="badge" :style="{ background: activePhase.color + '22', color: activePhase.color, border: '1px solid ' + activePhase.color }">
            {{ phaseProgress(activePhase) }}%
          </span>
        </div>

        <!-- Task Cards -->
        <div class="space-y-2">
          <div
            v-for="(task, index) in activePhase.tasks"
            :key="task.id"
            class="p-4 flex items-start gap-4"
            style="background: var(--cyberpunk-surface); border: 1px solid var(--cyberpunk-border); transition: all 0.2s ease; cursor: pointer;"
            :style="completedTaskIds.has(task.id) ? { borderColor: 'rgba(0,255,136,0.3)', background: 'rgba(0,255,136,0.04)' } : {}"
            @mouseenter="e => e.currentTarget.style.borderColor = 'var(--cyberpunk-border-strong)'"
            @mouseleave="e => e.currentTarget.style.borderColor = completedTaskIds.has(task.id) ? 'rgba(0,255,136,0.3)' : 'var(--cyberpunk-border)'"
            @click="openTask(task.id)"
          >
            <!-- Checkbox — stops propagation so clicking it doesn't navigate -->
            <div
              class="flex-shrink-0 flex items-center justify-center"
              style="width: 1.5rem; height: 1.5rem; border: 2px solid; margin-top: 0.1rem; transition: all 0.2s ease; flex-shrink: 0;"
              :style="{
                borderColor: completedTaskIds.has(task.id) ? '#00ff88' : 'var(--cyberpunk-border-strong)',
                background: completedTaskIds.has(task.id) ? 'rgba(0,255,136,0.2)' : 'transparent'
              }"
              @click.stop="toggleTask(task.id)"
            >
              <svg
                v-if="completedTaskIds.has(task.id)"
                style="width: 0.875rem; height: 0.875rem; color: #00ff88;"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <!-- Task Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1 flex-wrap">
                <!-- Task number -->
                <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--cyberpunk-text-tertiary);">
                  #{{ String(index + 1).padStart(2, '0') }}
                </span>
                <!-- Icon -->
                <span style="font-size: 0.9rem; line-height: 1;">{{ task.icon }}</span>
                <!-- Task title -->
                <span
                  class="font-semibold text-sm"
                  :style="{
                    color: completedTaskIds.has(task.id) ? 'var(--cyberpunk-text-secondary)' : 'var(--cyberpunk-text)',
                    textDecoration: completedTaskIds.has(task.id) ? 'line-through' : 'none'
                  }"
                >
                  {{ task.title }}
                </span>
                <!-- Tier badge (non-free tasks) -->
                <span
                  v-if="task.tier !== 'free'"
                  style="font-family: var(--font-mono); font-size: 0.6rem; font-weight: 700; letter-spacing: 0.5px; padding: 0.1rem 0.4rem; border: 1px solid;"
                  :style="{
                    color: tierColor(task.tier),
                    borderColor: tierColor(task.tier),
                    background: tierColor(task.tier) + '18'
                  }"
                >
                  {{ tierLabel(task.tier) }}
                </span>
              </div>
              <p style="color: var(--cyberpunk-text-secondary); font-size: 0.8rem; line-height: 1.5;">
                {{ task.description }}
              </p>
            </div>

            <!-- Estimated time + arrow -->
            <div class="flex-shrink-0 flex flex-col items-end gap-1">
              <div
                class="text-xs"
                style="font-family: var(--font-mono); color: var(--cyberpunk-text-tertiary); white-space: nowrap;"
              >
                {{ task.timeEstimate }}
              </div>
              <span style="color: var(--cyberpunk-border-strong); font-size: 0.75rem;">→</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useProjectStore } from '@/stores/projectStore'
import { tasks as allTasks, phases as phasesMeta } from '@/tasks/index.js'

const router = useRouter()
const authStore = useAuthStore()
const projectStore = useProjectStore()

// Selected phase — default to Phase 1
const selectedPhase = ref(1)

// User info from auth store
const userEmail = computed(() => authStore.user?.email || '')
const userFirstName = computed(() => {
  const email = authStore.user?.email || ''
  return email.split('@')[0] || 'Developer'
})

// Completed task IDs — derived from projectStore, persisted to Supabase
const completedTaskIds = computed(() => {
  const tasks = projectStore.currentProjectTasks || {}
  const ids = new Set()
  for (const [taskId, taskState] of Object.entries(tasks)) {
    if (taskState?.completed) ids.add(taskId)
  }
  return ids
})

// Phase display colors — keyed by phase number
const phaseColors = {
  1: '#00d9ff',
  2: '#c9004f',
  3: '#ffbe0b',
  4: '#00ff88'
}

// Phase descriptions
const phaseDescriptions = {
  1: 'Validate your idea, set up your foundation, and capture your first leads before you announce.',
  2: 'Ship it publicly, hit the launch platforms, and get your first real users through the door.',
  3: 'Convert free users to paying customers, gather feedback, and build repeatable retention.',
  4: 'Systematize what works, scale your best channels, and build a growth machine.'
}

// Build the phases array from the real task registry
const phases = computed(() => {
  return phasesMeta.map(meta => {
    const phaseTasks = allTasks.filter(t => t.phase === meta.number)
    return {
      id: meta.number,
      title: meta.label,
      description: phaseDescriptions[meta.number],
      tier: meta.tier,
      color: phaseColors[meta.number],
      tasks: phaseTasks
    }
  })
})

// Compute totals across all 32 real tasks
const totalTasks = computed(() => allTasks.length)
const totalCompleted = computed(() => completedTaskIds.value.size)
const overallProgressPercent = computed(() => {
  if (totalTasks.value === 0) return 0
  return Math.round((totalCompleted.value / totalTasks.value) * 100)
})

// Active phase object
const activePhase = computed(() => phases.value.find(p => p.id === selectedPhase.value) || null)

const phaseProgress = (phase) => {
  if (!phase.tasks.length) return 0
  const done = phase.tasks.filter(t => completedTaskIds.value.has(t.id)).length
  return Math.round((done / phase.tasks.length) * 100)
}

const phaseCompleted = (phase) => {
  return phase.tasks.filter(t => completedTaskIds.value.has(t.id)).length
}

const selectPhase = (phaseId) => {
  selectedPhase.value = phaseId
}

// Toggle completion state — persists to Supabase via projectStore
const toggleTask = async (taskId) => {
  const isCompleted = completedTaskIds.value.has(taskId)
  try {
    await projectStore.updateTask(taskId, {
      completed: !isCompleted,
      completed_at: !isCompleted ? new Date().toISOString() : null
    })
  } catch (err) {
    console.error('Failed to toggle task:', err)
  }
}

// Navigate to task detail — uses the real task ID from the registry
const openTask = (taskId) => {
  router.push({ name: 'TaskDetail', params: { taskId } })
}

// Tier badge label helpers
const tierLabel = (tier) => {
  if (tier === 'free') return 'FREE'
  if (tier === 'launcher') return 'LAUNCHER'
  if (tier === 'pro') return 'PRO'
  return tier.toUpperCase()
}

// Tier badge color — returns a CSS color string
const tierColor = (tier) => {
  if (tier === 'free') return '#00ff88'
  if (tier === 'launcher') return '#00d9ff'
  if (tier === 'pro') return '#c9004f'
  return 'var(--cyberpunk-text-secondary)'
}

const handleSignOut = async () => {
  await authStore.handleSignOut()
  router.push('/auth')
}
</script>
