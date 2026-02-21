import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('hero CTA links to auth page', async ({ page }) => {
    await page.goto('/')
    await page.locator('.hero__actions .btn-primary').click()
    await page.waitForURL('/auth')
    await expect(page.locator('#email')).toBeVisible()
  })

  test('hero pricing link scrolls to pricing section', async ({ page }) => {
    await page.goto('/')
    const pricingLink = page.locator('.hero__actions .btn-ghost')
    await expect(pricingLink).toBeVisible()
    // The link should point to #pricing
    await expect(pricingLink).toHaveAttribute('href', '#pricing')
  })

  test('pricing page FAQ links back to home', async ({ page }) => {
    await page.goto('/pricing')
    const faqLink = page.locator('.pricing-page__faq-link').first()
    await expect(faqLink).toBeVisible()
  })
})
