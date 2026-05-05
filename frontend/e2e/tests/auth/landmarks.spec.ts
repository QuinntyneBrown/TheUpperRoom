// Traces to: Semantic landmarks — main element for keyboard navigation
// T48: app shell wraps page content in <main> landmark
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Semantic landmark regions', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('main landmark exists on authenticated pages', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/hackathons');
    await expect(page.locator('main')).toBeVisible({ timeout: 3000 });
  });

  test('main landmark exists on auth pages', async ({ page }) => {
    await page.goto('/auth/sign-in');
    await expect(page.locator('main')).toBeVisible({ timeout: 3000 });
  });
});
