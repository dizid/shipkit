import { test, expect } from '@playwright/test'

test.describe('Task Detail', () => {
  test('task detail page loads with content', async ({ page }) => {
    await page.goto('/dashboard/task/phase1-1')
    await page.waitForURL(/\/dashboard\/task\//, { timeout: 10000 })

    // Task should have a title and description
    await expect(page.locator('.task-detail h1')).toBeVisible()
    await expect(page.locator('.task-description')).toBeVisible()
  })

  test('task detail has steps and sections', async ({ page }) => {
    await page.goto('/dashboard/task/phase1-1')
    await page.waitForURL(/\/dashboard\/task\//, { timeout: 10000 })

    // Steps section exists
    await expect(page.getByRole('heading', { name: 'Steps' })).toBeVisible()
    // Generate with AI section exists
    await expect(page.getByRole('heading', { name: 'Generate with AI' })).toBeVisible()
  })

  test('back link returns to dashboard', async ({ page }) => {
    await page.goto('/dashboard/task/phase1-1')
    await page.waitForURL(/\/dashboard\/task\//, { timeout: 10000 })

    await page.locator('.back-link').click()
    await page.waitForURL('/dashboard', { timeout: 10000 })
  })
})
