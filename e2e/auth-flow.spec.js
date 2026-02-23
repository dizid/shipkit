import { test, expect } from '@playwright/test'

// These tests run WITHOUT auth (public project) — they test the auth form itself
test.describe('Auth Flow', () => {
  test('shows validation error for wrong password', async ({ page }) => {
    await page.goto('/auth')
    await page.locator('#email').fill('e2e-test@launchpilot.dev')
    await page.locator('#password').fill('WrongPassword999')
    await page.locator('form button[type="submit"]').click()

    // Should show error message (stay on auth page)
    await expect(page.locator('[style*="rgba(201, 0, 79"]')).toBeVisible({ timeout: 10000 })
  })

  test('toggle between sign in and sign up', async ({ page }) => {
    await page.goto('/auth')
    // Default is sign in
    await expect(page.locator('h1')).toContainText('Welcome Back')

    // Click toggle to sign up
    const toggleLink = page.getByText('Create an account')
    if (await toggleLink.isVisible()) {
      await toggleLink.click()
      await expect(page.locator('h1')).toContainText('Create Account')
    }
  })
})
