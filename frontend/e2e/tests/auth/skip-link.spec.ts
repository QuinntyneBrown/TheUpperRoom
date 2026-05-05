// Traces to: Skip-to-content link — WCAG 2.4.1 Bypass Blocks
// T49: skip link appears on focus and links to main content
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Skip-to-content link', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('skip link exists and targets main-content', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/hackathons');
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached({ timeout: 3000 });
  });

  test('main element has id="main-content"', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/hackathons');
    await expect(page.locator('main#main-content')).toBeAttached({ timeout: 3000 });
  });

  test('skip link becomes visible on focus', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/hackathons');
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeVisible({ timeout: 3000 });
  });
});
