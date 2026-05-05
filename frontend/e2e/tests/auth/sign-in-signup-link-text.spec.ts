// Traces to: T108 — Sign-in page signup link text wrong
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Sign-in signup row', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/sign-in');
  });

  test('shows "New to The Upper Room?" prefix text', async ({ page }) => {
    await expect(page.getByText('New to The Upper Room?')).toBeVisible({ timeout: 3000 });
  });

  test('signup link says "Request access" not "Create an account"', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Request access' })).toBeVisible({ timeout: 3000 });
    await expect(page.getByRole('link', { name: 'Create an account' })).not.toBeVisible();
  });
});
