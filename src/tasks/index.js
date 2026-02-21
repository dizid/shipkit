/**
 * LaunchPilot Task Registry — Single Source of Truth
 *
 * Import this file anywhere you need task data. Do NOT import
 * individual phase files directly in components — always go through here.
 *
 * Usage:
 *   import { getAllTasks, getTaskById, getPhaseProgress } from '@/tasks'
 *   import { tasks } from '@/tasks'
 */

import { phase1Tasks } from './phase1-prelaunch.js'
import { phase2Tasks } from './phase2-launch.js'
import { phase3Tasks } from './phase3-growth.js'
import { phase4Tasks } from './phase4-scaling.js'

// Re-export helper functions so callers don't need to import schema.js directly
export {
  getTasksByPhase,
  getTaskById,
  getAllTasks,
  getTasksByTier,
  getPhaseProgress
} from './schema.js'

/**
 * All 32 tasks in phase order.
 * This is the canonical flat array used by all consumers.
 *
 * @type {import('./schema.js').TaskDefinition[]}
 */
export const tasks = [
  ...phase1Tasks,
  ...phase2Tasks,
  ...phase3Tasks,
  ...phase4Tasks
]

// ─── Convenience wrappers (bind allTasks so callers don't need to pass it) ──

import {
  getTasksByPhase as _getTasksByPhase,
  getTaskById as _getTaskById,
  getTasksByTier as _getTasksByTier,
  getPhaseProgress as _getPhaseProgress
} from './schema.js'

/**
 * Returns all tasks for a given phase.
 * @param {1|2|3|4} phase
 * @returns {import('./schema.js').TaskDefinition[]}
 */
export function getPhase(phase) {
  return _getTasksByPhase(phase, tasks)
}

/**
 * Returns a single task by its ID, or undefined if not found.
 * @param {string} id - e.g., 'phase1-1'
 * @returns {import('./schema.js').TaskDefinition|undefined}
 */
export function findTask(id) {
  return _getTaskById(id, tasks)
}

/**
 * Returns all tasks accessible at a given tier level.
 * free < launcher < pro
 * @param {'free'|'launcher'|'pro'} tier
 * @returns {import('./schema.js').TaskDefinition[]}
 */
export function getAccessibleTasks(tier) {
  return _getTasksByTier(tier, tasks)
}

/**
 * Returns progress stats for a phase given a set of completed task IDs.
 * @param {1|2|3|4} phase
 * @param {string[]} completedTaskIds
 * @returns {{ total: number, completed: number, percentage: number }}
 */
export function getProgress(phase, completedTaskIds) {
  return _getPhaseProgress(phase, completedTaskIds, tasks)
}

/**
 * Phase metadata for display purposes.
 * Use this to build phase navigation or progress bars.
 */
export const phases = [
  { number: 1, label: 'Pre-Launch', tier: 'free', taskCount: phase1Tasks.length },
  { number: 2, label: 'Launch Week', tier: 'launcher', taskCount: phase2Tasks.length },
  { number: 3, label: 'First 30 Days', tier: 'launcher', taskCount: phase3Tasks.length },
  { number: 4, label: 'Scaling', tier: 'pro', taskCount: phase4Tasks.length }
]
