/**
 * Project Service
 *
 * Handles all Supabase CRUD operations for projects.
 * Shares the LaunchPilot Supabase instance.
 *
 * Table: projects
 *   - id (uuid, pk)
 *   - user_id (uuid, fk auth.users)
 *   - name (text)
 *   - description (text)
 *   - status (text: 'active', 'paused', 'completed')
 *   - created_at (timestamptz)
 *   - updated_at (timestamptz)
 *
 * Table: project_data
 *   - id (uuid, pk)
 *   - project_id (uuid, fk projects)
 *   - key (text) — e.g. 'settings', 'tasks'
 *   - value (jsonb)
 *   - updated_at (timestamptz)
 *   - UNIQUE(project_id, key)
 */

import { supabase } from '@/utils/supabase'
import { logger } from '@/utils/logger'

// =============================================================================
// Project CRUD
// =============================================================================

/**
 * Get all projects for the current authenticated user
 * @returns {Promise<object[]>} Array of project records
 */
export async function getProjects() {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    logger.error('[ProjectService] getProjects failed:', error)
    throw error
  }

  return data || []
}

/**
 * Get a single project by ID
 * @param {string} projectId - Project UUID
 * @returns {Promise<object|null>} Project record or null
 */
export async function getProject(projectId) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // Not found
    logger.error('[ProjectService] getProject failed:', error)
    throw error
  }

  return data
}

/**
 * Create a new project for the current user
 * @param {string} name - Project name (app name)
 * @param {string} description - Project description
 * @returns {Promise<object>} Created project record
 */
export async function createProject(name, description = '') {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('projects')
    .insert({
      user_id: user.id,
      name,
      description,
      status: 'active'
    })
    .select()

  if (error) {
    logger.error('[ProjectService] createProject failed:', error)
    throw error
  }

  return data?.[0]
}

/**
 * Update a project's core fields (name, description, status)
 * @param {string} projectId - Project UUID
 * @param {object} updates - Fields to update
 * @returns {Promise<object>} Updated project record
 */
export async function updateProject(projectId, updates) {
  const { data, error } = await supabase
    .from('projects')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', projectId)
    .select()

  if (error) {
    logger.error('[ProjectService] updateProject failed:', error)
    throw error
  }

  return data?.[0]
}

/**
 * Delete a project and all its associated data
 * @param {string} projectId - Project UUID
 */
export async function deleteProject(projectId) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)

  if (error) {
    logger.error('[ProjectService] deleteProject failed:', error)
    throw error
  }
}

// =============================================================================
// Project Data (key/value store — settings, tasks, etc.)
// =============================================================================

/**
 * Read a single key from project_data
 * @param {string} projectId - Project UUID
 * @param {string} key - Data key (e.g. 'settings', 'tasks')
 * @returns {Promise<any>} The stored value or null
 */
async function getProjectData(projectId, key) {
  const { data, error } = await supabase
    .from('project_data')
    .select('value')
    .eq('project_id', projectId)
    .eq('key', key)
    .maybeSingle()

  if (error) {
    logger.error(`[ProjectService] getProjectData(${key}) failed:`, error)
    throw error
  }

  return data?.value ?? null
}

/**
 * Save a single key to project_data (upsert)
 * @param {string} projectId - Project UUID
 * @param {string} key - Data key
 * @param {any} value - JSON-serializable value
 */
async function saveProjectDataKey(projectId, key, value) {
  const { error } = await supabase
    .from('project_data')
    .upsert({
      project_id: projectId,
      key,
      value,
      updated_at: new Date().toISOString()
    }, { onConflict: 'project_id,key' })

  if (error) {
    logger.error(`[ProjectService] saveProjectDataKey(${key}) failed:`, error)
    throw error
  }
}

/**
 * Get all project data keys at once (bulk load)
 * @param {string} projectId - Project UUID
 * @returns {Promise<object>} { settings: {}, tasks: {} }
 */
export async function getAllProjectData(projectId) {
  const { data, error } = await supabase
    .from('project_data')
    .select('key, value')
    .eq('project_id', projectId)

  if (error) {
    logger.error('[ProjectService] getAllProjectData failed:', error)
    throw error
  }

  const result = { settings: null, tasks: {} }
  for (const row of data || []) {
    result[row.key] = row.value
  }

  return result
}

/**
 * Initialize a new project with default settings and tasks structure.
 * Creates the project_data rows if they don't exist.
 * @param {string} projectId - Project UUID
 */
export async function initializeProject(projectId) {
  const defaultSettings = {
    appName: '',
    appDescription: '',
    targetAudience: '',
    techStack: [],
    primaryGoal: '',
    launchDate: null,
    teamSize: 'solo',
    currentStage: 'building',
    appType: null
  }

  await Promise.all([
    saveProjectDataKey(projectId, 'settings', defaultSettings),
    saveProjectDataKey(projectId, 'tasks', {})
  ])
}

/**
 * Save project settings (onboarding data, app info, etc.)
 * Merges with existing settings.
 * @param {string} projectId - Project UUID
 * @param {object} settings - Settings to save (merged with existing)
 * @returns {Promise<object>} The merged settings object
 */
export async function saveProjectSettings(projectId, settings) {
  const existing = (await getProjectData(projectId, 'settings')) || {}
  const merged = { ...existing, ...settings }
  await saveProjectDataKey(projectId, 'settings', merged)
  return merged
}

/**
 * Save project task completion states
 * @param {string} projectId - Project UUID
 * @param {object} tasks - Task states object keyed by taskId
 */
export async function saveProjectTasks(projectId, tasks) {
  await saveProjectDataKey(projectId, 'tasks', tasks)
}
