import { test, expect } from '@playwright/test'

test.describe('Auth Guard', () => {
  test('dashboard redirects unauthenticated users to auth', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL(/\/auth/)
    await expect(page.locator('#email')).toBeVisible()
    // Should preserve redirect path in query
    expect(page.url()).toContain('redirect')
  })

  test('onboarding redirects unauthenticated users to auth', async ({ page }) => {
    await page.goto('/onboarding')
    await page.waitForURL(/\/auth/)
    await expect(page.locator('#email')).toBeVisible()
  })

  test('dashboard settings redirects unauthenticated users to auth', async ({ page }) => {
    await page.goto('/dashboard/settings')
    await page.waitForURL(/\/auth/)
    await expect(page.locator('#email')).toBeVisible()
    expect(page.url()).toContain('redirect')
  })

  test('task detail redirects unauthenticated users to auth', async ({ page }) => {
    await page.goto('/dashboard/task/phase1-1')
    await page.waitForURL(/\/auth/)
    await expect(page.locator('#email')).toBeVisible()
  })
})
