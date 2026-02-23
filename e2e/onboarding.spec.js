import { test, expect } from '@playwright/test'

test.describe('Onboarding', () => {
  test('user with project is redirected from onboarding to dashboard', async ({ page }) => {
    // Auth setup already created a project, so /onboarding should redirect to /dashboard
    await page.goto('/onboarding')
    await page.waitForURL('/dashboard', { timeout: 10000 })
    await expect(page.locator('h1')).toContainText('Ready to ship')
  })
})
