// T87: reset password page is accessible at /auth/reset-password (conventional URL)
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Reset password route', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('reset-password page renders at /auth/reset-password', async ({ page }) => {
    await page.goto('/auth/reset-password?token=test-token&email=user@example.com');
    await expect(page.getByTestId('reset-password-submit-btn')).toBeVisible({ timeout: 3000 });
  });
});
