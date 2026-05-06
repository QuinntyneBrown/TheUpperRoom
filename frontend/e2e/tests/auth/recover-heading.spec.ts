// BUG-005: design frame y1VvT shows the recover page heading "Reset password"
// followed by subtitle "We will email a recovery link if an account matches."
import { test, expect } from '../../fixtures';

test.describe('Recover page heading + subtitle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/forgot-password');
    await expect(page.getByTestId('forgot-password-submit-btn')).toBeVisible({ timeout: 5000 });
  });

  test('heading reads "Reset password"', async ({ page }) => {
    await expect(page.getByTestId('recover-heading')).toHaveText('Reset password');
  });

  test('subtitle matches the design copy', async ({ page }) => {
    await expect(page.getByTestId('recover-subtitle')).toHaveText(
      'We will email a recovery link if an account matches.'
    );
  });
});
