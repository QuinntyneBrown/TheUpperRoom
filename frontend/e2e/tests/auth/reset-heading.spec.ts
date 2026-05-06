// BUG-006: design frame ItGzU shows the reset page heading
// "Choose a new password" (current implementation reads "Reset password").
import { test, expect } from '../../fixtures';

test.describe('Reset page heading', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/reset-password?token=test-token&email=user@example.com');
    await expect(page.getByTestId('reset-password-submit-btn')).toBeVisible({ timeout: 5000 });
  });

  test('heading reads "Choose a new password"', async ({ page }) => {
    await expect(page.getByTestId('reset-heading')).toHaveText('Choose a new password');
  });
});
