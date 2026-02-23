import { test as setup, expect } from '@playwright/test'

const TEST_EMAIL = 'e2e-test@launchpilot.dev'
const TEST_PASSWORD = 'TestPass123!'

setup('authenticate and ensure project exists', async ({ page }) => {
  await page.goto('/auth')

  // Fill login form
  await page.locator('#email').fill(TEST_EMAIL)
  await page.locator('#password').fill(TEST_PASSWORD)
  await page.locator('form button[type="submit"]').click()

  // Wait for redirect — new user goes to /onboarding, existing user goes to /dashboard
  await page.waitForURL(/\/(onboarding|dashboard)/, { timeout: 10000 })

  // If landed on onboarding, create a project so all authenticated tests have one
  if (page.url().includes('/onboarding')) {
    await page.locator('#appName').fill('E2E Test App')
    await page.locator('#appDescription').fill('An app created by automated E2E tests')
    await page.locator('#targetAudience').fill('Automated test bots')
    await page.locator('form button[type="submit"]').click()
    await page.waitForURL('/dashboard', { timeout: 15000 })
  }

  // Now on dashboard with a project — save state
  await page.context().storageState({ path: 'e2e/.auth/user.json' })
})
