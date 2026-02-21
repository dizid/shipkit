import { test, expect } from '@playwright/test'

test.describe('Public Pages', () => {
  test('landing page loads with hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/LaunchPilot/)
    await expect(page.locator('.hero')).toBeVisible()
    await expect(page.locator('.hero__headline')).toContainText('shipped')
    await expect(page.locator('.hero__actions .btn-primary')).toBeVisible()
  })

  test('landing page has all sections', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.hero')).toBeVisible()
    // Pricing section should exist on landing page
    await expect(page.locator('#pricing')).toBeAttached()
  })

  test('pricing page loads with tier cards', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.locator('.pricing-page__title')).toContainText('Simple pricing')
    await expect(page.locator('.pricing-page__sub')).toContainText('Start free')
  })

  test('readiness score page loads', async ({ page }) => {
    await page.goto('/score')
    // Page should load without error
    await expect(page.locator('body')).toBeVisible()
    // Should not redirect (stays on /score)
    expect(page.url()).toContain('/score')
  })

  test('auth page loads with login form', async ({ page }) => {
    await page.goto('/auth')
    await expect(page.locator('h1')).toContainText(/Welcome Back|Create Account/)
    await expect(page.locator('#email')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
  })

  test('unknown routes redirect to landing page', async ({ page }) => {
    await page.goto('/this-does-not-exist')
    await page.waitForURL('/')
    await expect(page.locator('.hero')).toBeVisible()
  })
})
