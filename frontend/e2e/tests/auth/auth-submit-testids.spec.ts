// Traces to: T67 — auth submit buttons have data-testid for reliable E2E targeting
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Auth form submit button testids', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('sign-in submit button has data-testid', async ({ page }) => {
    await page.goto('/auth/sign-in');
    await expect(page.getByTestId('sign-in-submit-btn')).toBeVisible({ timeout: 3000 });
  });

  test('register submit button has data-testid', async ({ page }) => {
    await page.goto('/auth/register');
    await expect(page.getByTestId('register-submit-btn')).toBeVisible({ timeout: 3000 });
  });

  test('forgot-password submit button has data-testid', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    await expect(page.getByTestId('forgot-password-submit-btn')).toBeVisible({ timeout: 3000 });
  });

  test('reset-password submit button has data-testid', async ({ page }) => {
    await page.goto('/auth/reset-password?token=fake');
    await expect(page.getByTestId('reset-password-submit-btn')).toBeVisible({ timeout: 3000 });
  });
});
