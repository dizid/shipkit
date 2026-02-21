/**
 * ShipKit Task Schema
 *
 * Defines the TypeScript-style JSDoc types for the task system
 * and exports helper functions for querying tasks.
 *
 * Single source of truth for task structure — all task files must
 * conform to TaskDefinition. Never add fields that aren't defined here.
 */

/**
 * @typedef {Object} Subtask
 * @property {string} title - Short label for the subtask
 * @property {string} description - One sentence of context/instruction
 */

/**
 * @typedef {Object} Step
 * @property {string} title - Step heading
 * @property {string} description - What to do and why (2-4 sentences)
 * @property {Subtask[]} subtasks - Concrete actions within this step
 */

/**
 * @typedef {Object} FormField
 * @property {string} id - snake_case identifier, used as AI prompt placeholder
 * @property {'text'|'textarea'|'select'|'checkboxes'} type - Input type
 * @property {string} label - Human-readable label
 * @property {string} placeholder - Example value shown in input
 * @property {boolean} [required] - Whether field is required before AI generation
 * @property {Array<{value: string, label: string}>} [options] - Options for select/checkboxes
 */

/**
 * @typedef {Object} AiConfig
 * @property {string} promptTemplate - Template string with {field_id} placeholders
 * @property {number} temperature - 0.0–1.0, higher = more creative
 * @property {number} maxTokens - Max tokens in AI response
 */

/**
 * @typedef {Object} Template
 * @property {string} title - Template name shown in UI
 * @property {string} content - Ready-to-use copy with [PLACEHOLDER] markers
 */

/**
 * @typedef {Object} Tool
 * @property {string} name - Tool name
 * @property {string} url - Tool URL (no trailing slash)
 * @property {string} freeDetails - What you get for free / why devs should use it
 */

/**
 * @typedef {Object} TaskDefinition
 * @property {string} id - Unique ID in format phase{N}-{number} (e.g., 'phase1-1')
 * @property {1|2|3|4} phase - Launch phase number
 * @property {string} phaseLabel - Human-readable phase name
 * @property {'free'|'launcher'|'pro'} tier - Minimum subscription tier required
 * @property {string} title - Task title (≤ 60 chars)
 * @property {string} description - 1-2 sentences, developer-native language
 * @property {string} timeEstimate - e.g., '2-4 hours'
 * @property {string} icon - Single emoji
 * @property {string} category - e.g., 'Foundation', 'Outreach', 'Growth'
 * @property {Step[]} steps - Ordered list of steps (aim for 5 per task)
 * @property {FormField[]} formFields - Inputs collected before AI generation
 * @property {AiConfig} aiConfig - AI generation configuration
 * @property {Template[]} templates - Copy-paste ready text blocks
 * @property {Tool[]} tools - Recommended tools for this task
 * @property {string[]} doneCriteria - Checklist: how to know the task is truly done
 * @property {string[]} commonMistakes - 2-3 things devs get wrong on this task
 */

// ─── Helper Functions ────────────────────────────────────────────────────────

/**
 * Returns all tasks for a given phase.
 * @param {1|2|3|4} phase
 * @param {TaskDefinition[]} allTasks
 * @returns {TaskDefinition[]}
 */
export function getTasksByPhase(phase, allTasks) {
  return allTasks.filter(task => task.phase === phase)
}

/**
 * Returns a single task by ID, or undefined if not found.
 * @param {string} id
 * @param {TaskDefinition[]} allTasks
 * @returns {TaskDefinition|undefined}
 */
export function getTaskById(id, allTasks) {
  return allTasks.find(task => task.id === id)
}

/**
 * Returns all tasks (alias for passing through the full array).
 * @param {TaskDefinition[]} allTasks
 * @returns {TaskDefinition[]}
 */
export function getAllTasks(allTasks) {
  return allTasks
}

/**
 * Returns all tasks accessible at the given tier level.
 * Tier hierarchy: free < launcher < pro
 * @param {'free'|'launcher'|'pro'} tier
 * @param {TaskDefinition[]} allTasks
 * @returns {TaskDefinition[]}
 */
export function getTasksByTier(tier, allTasks) {
  const tierOrder = { free: 0, launcher: 1, pro: 2 }
  const tierLevel = tierOrder[tier] ?? 0
  return allTasks.filter(task => tierOrder[task.tier] <= tierLevel)
}

/**
 * Returns progress stats for a given phase.
 * @param {1|2|3|4} phase
 * @param {string[]} completedTaskIds - Array of completed task IDs
 * @param {TaskDefinition[]} allTasks
 * @returns {{ total: number, completed: number, percentage: number }}
 */
export function getPhaseProgress(phase, completedTaskIds, allTasks) {
  const phaseTasks = getTasksByPhase(phase, allTasks)
  const completedSet = new Set(completedTaskIds)
  const completed = phaseTasks.filter(task => completedSet.has(task.id)).length
  const total = phaseTasks.length
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100)
  return { total, completed, percentage }
}
