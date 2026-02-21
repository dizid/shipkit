/**
 * LaunchPilot Vue Router
 *
 * Routes:
 * - /                   → LandingPage (public)
 * - /auth               → AuthForm (public)
 * - /reset-password     → ResetPassword (public)
 * - /onboarding         → Onboarding wizard (auth required, no project yet)
 * - /dashboard          → DashboardContainer (auth required, project required)
 * - /dashboard/task/:taskId → Task detail view (auth required, project required)
 * - /dashboard/settings → Project settings (auth required, project required)
 * - /:pathMatch(.*)     → redirect to /
 *
 * Auth guard behavior:
 * - Waits for authStore.isInitialized before routing to avoid race conditions
 * - Unauthenticated users hitting a protected route → /auth
 * - Authenticated users without a project → /onboarding
 * - Authenticated users with a project can access dashboard routes
 * - Authenticated users hitting /auth or / → /dashboard
 * - Authenticated users without a project hitting /dashboard → /onboarding
 */

import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useProjectStore } from '@/stores/projectStore'

// ─── Route components ─────────────────────────────────────────────────────────

const LandingPage = () => import('@/components/LandingPage.vue')
const PricingPage = () => import('@/components/Pricing/PricingPage.vue')
const ReadinessScore = () => import('@/components/ReadinessScore/ReadinessScore.vue')
const AuthForm = () => import('@/components/Auth/AuthForm.vue')
const ResetPassword = () => import('@/components/Auth/ResetPassword.vue')
const OnboardingWizard = () => import('@/components/Onboarding/OnboardingWizard.vue')
const DashboardContainer = () => import('@/components/Dashboard/DashboardContainer.vue')
const TaskDetailView = () => import('@/components/Dashboard/TaskDetailView.vue')
const ProjectSettings = () => import('@/components/Settings/ProjectSettings.vue')

// ─── Route definitions ───────────────────────────────────────────────────────

const routes = [
  // Public routes — no auth required
  {
    path: '/',
    name: 'Home',
    component: LandingPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: PricingPage,
    meta: { requiresAuth: false }
  },
  {
    path: '/score',
    name: 'ReadinessScore',
    component: ReadinessScore,
    meta: { requiresAuth: false }
  },
  {
    path: '/auth',
    name: 'Auth',
    component: AuthForm,
    meta: { requiresAuth: false }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { requiresAuth: false }
  },

  // Onboarding — auth required, but no project required yet
  {
    path: '/onboarding',
    name: 'Onboarding',
    component: OnboardingWizard,
    meta: { requiresAuth: true, requiresProject: false }
  },

  // Dashboard routes — auth + project required
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardContainer,
    meta: { requiresAuth: true, requiresProject: true }
  },
  {
    path: '/dashboard/task/:taskId',
    name: 'TaskDetail',
    component: TaskDetailView,
    meta: { requiresAuth: true, requiresProject: true },
    props: true
  },
  {
    path: '/dashboard/settings',
    name: 'Settings',
    component: ProjectSettings,
    meta: { requiresAuth: true, requiresProject: true }
  },

  // Catch-all: redirect unknown paths to home
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

// ─── Router instance ─────────────────────────────────────────────────────────

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

// ─── Global navigation guard ─────────────────────────────────────────────────

/**
 * Wait for auth store to initialize (async session restore on page load).
 * Polls every 100ms up to a 5s timeout.
 */
async function waitForAuth(authStore) {
  if (authStore.isInitialized) return

  await new Promise((resolve) => {
    const startedAt = Date.now()

    const check = () => {
      if (authStore.isInitialized) {
        resolve()
        return
      }
      if (Date.now() - startedAt > 5000) {
        console.warn('[router] Auth initialization timed out')
        resolve()
        return
      }
      setTimeout(check, 100)
    }

    check()
  })
}

/**
 * Ensure the project store has loaded projects for the current user.
 * Only fetches once per session (the store tracks lastDataFetch).
 */
async function ensureProjectsLoaded(projectStore) {
  if (projectStore.projects.length > 0 || projectStore.currentProject) return
  await projectStore.fetchProjects()
}

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Wait for auth to initialize — prevents race condition on hard page load
  await waitForAuth(authStore)

  const isAuthenticated = !!authStore.user

  // Unauthenticated user trying to access a protected route → login
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Auth', query: { redirect: to.fullPath } })
    return
  }

  // Authenticated user hitting public auth pages or landing → dashboard
  if ((to.name === 'Auth' || to.name === 'Home') && isAuthenticated) {
    next({ name: 'Dashboard' })
    return
  }

  // For authenticated users on project-aware routes, check project state
  if (isAuthenticated && to.meta.requiresAuth) {
    const projectStore = useProjectStore()

    try {
      await ensureProjectsLoaded(projectStore)
    } catch (err) {
      // If fetching projects fails (network error, etc.) let them through
      // and handle the error state in the component
      console.error('[router] Failed to load projects:', err)
    }

    const hasProject = projectStore.currentProject !== null

    // Dashboard routes require a project — redirect to onboarding if none
    if (to.meta.requiresProject && !hasProject) {
      next({ name: 'Onboarding' })
      return
    }

    // Onboarding route — if user already has a project, send to dashboard
    if (to.name === 'Onboarding' && hasProject) {
      next({ name: 'Dashboard' })
      return
    }
  }

  next()
})

// ─── Auth success helper ─────────────────────────────────────────────────────

/**
 * Call after successful login to navigate to the right destination.
 * Checks if user has a project and routes accordingly.
 *
 * @param {string} [redirectPath] - Optional explicit path to redirect to
 */
export const handleAuthSuccess = async (redirectPath) => {
  if (redirectPath && redirectPath !== '/') {
    router.push(redirectPath)
    return
  }

  // Check if user has a project
  try {
    const projectStore = useProjectStore()
    await projectStore.fetchProjects()

    if (projectStore.currentProject) {
      router.push('/dashboard')
    } else {
      router.push('/onboarding')
    }
  } catch {
    // Fallback: let the router guard handle it
    router.push('/dashboard')
  }
}

export default router
