import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test('dashboard loads with greeting and phases', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL('/dashboard', { timeout: 10000 })

    // User greeting
    await expect(page.locator('h1')).toContainText('Ready to ship')

    // 4 phase cards
    const phaseCards = page.locator('.grid button')
    await expect(phaseCards).toHaveCount(4)

    // First phase card should show "Phase 1"
    await expect(phaseCards.first()).toContainText('Phase 1')
  })

  test('phase cards are clickable and show tasks', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL('/dashboard', { timeout: 10000 })

    // Click first phase card
    await page.locator('.grid button').first().click()

    // Should show phase header and task list
    await expect(page.locator('h2')).toContainText('Phase 1')
  })

  test('sign out logs user out', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL('/dashboard', { timeout: 10000 })

    await page.getByText('Sign Out').click()

    // After sign out, user is no longer on dashboard — router sends to /auth or /
    await page.waitForURL(/\/(auth|$)/, { timeout: 15000 })
    // Verify we're no longer on the dashboard
    expect(page.url()).not.toContain('/dashboard')
  })
})
