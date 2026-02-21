/**
 * Save State Composable
 *
 * Tracks the state of save operations and provides methods to update save status.
 * Used to display user feedback during saves ("Saving...", error messages, success).
 *
 * State Tracked:
 * - isSaving: boolean, true while save is in progress
 * - saveError: string, error message if save failed (null if no error)
 * - lastSaveTime: Date, when the last successful save completed
 *
 * Usage Example:
 * ```javascript
 * import { useSaveState } from '@/composables/useSaveState'
 *
 * export default {
 *   setup() {
 *     const { isSaving, saveError, lastSaveTime, setSaving, setSaveError, clearError } = useSaveState()
 *
 *     const handleSave = async (data) => {
 *       setSaving(true)
 *       try {
 *         await projectStore.updateTaskData(taskId, data)
 *         lastSaveTime.value = new Date()
 *         clearError()
 *       } catch (error) {
 *         setSaveError(error.message)
 *       } finally {
 *         setSaving(false)
 *       }
 *     }
 *
 *     return {
 *       isSaving,
 *       saveError,
 *       lastSaveTime,
 *       handleSave
 *     }
 *   }
 * }
 * ```
 */

import { ref } from 'vue'

/**
 * Save state composable
 *
 * Provides reactive references and methods to track save operation state
 * Enables UI components to show "Saving...", error messages, and success feedback
 *
 * @returns {Object} Save state object with reactive refs and methods
 */
export const useSaveState = () => {
  /**
   * Tracks whether a save operation is currently in progress
   * @type {import('vue').Ref<boolean>}
   */
  const isSaving = ref(false)

  /**
   * Stores error message from failed save operation
   * Null when no error (either no save attempted or last save successful)
   * @type {import('vue').Ref<string|null>}
   */
  const saveError = ref(null)

  /**
   * Timestamp of when the last successful save completed
   * Null if no saves have completed yet
   * @type {import('vue').Ref<Date|null>}
   */
  const lastSaveTime = ref(null)

  /**
   * Set saving state
   * Called at the start of save operation (true) and when complete (false)
   *
   * @param {boolean} value - true when save starts, false when save completes
   */
  const setSaving = (value) => {
    isSaving.value = value
  }

  /**
   * Set save error message
   * Also automatically clears isSaving flag when error occurs
   *
   * @param {string|null} error - Error message string, or null to clear
   */
  const setSaveError = (error) => {
    saveError.value = error
    // Auto-clear saving flag if error occurs
    if (error) {
      isSaving.value = false
    }
  }

  /**
   * Clear any existing error message
   * Called after successful save or when user dismisses error
   */
  const clearError = () => {
    saveError.value = null
  }

  /**
   * Clear all save state (used on component unmount or reset)
   */
  const clearAll = () => {
    isSaving.value = false
    saveError.value = null
    lastSaveTime.value = null
  }

  /**
   * Update last save time to current time
   * Called after successful save
   */
  const recordSaveSuccess = () => {
    lastSaveTime.value = new Date()
    saveError.value = null
  }

  /**
   * Format last save time for display
   * Returns relative time like "just now", "2 minutes ago", etc.
   *
   * @returns {string} Formatted relative time
   */
  const formatLastSaveTime = () => {
    if (!lastSaveTime.value) return null

    const now = new Date()
    const diff = Math.floor((now - lastSaveTime.value) / 1000) // Difference in seconds

    if (diff < 30) {
      return 'just now'
    } else if (diff < 60) {
      return '1 minute ago'
    } else if (diff < 300) {
      const minutes = Math.floor(diff / 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else {
      // For times older than 5 minutes, show absolute time
      return lastSaveTime.value.toLocaleTimeString()
    }
  }

  return {
    // Reactive state
    isSaving,
    saveError,
    lastSaveTime,

    // Methods to update state
    setSaving,
    setSaveError,
    clearError,
    clearAll,
    recordSaveSuccess,

    // Utility methods
    formatLastSaveTime
  }
}
