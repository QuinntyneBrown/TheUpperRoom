// T150: forgot-password page must show security notice and use correct button label
import { test, expect } from '../../fixtures';

test.describe('Forgot password form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/forgot-password');
    await expect(page.getByTestId('forgot-password-submit-btn')).toBeVisible({ timeout: 5000 });
  });

  test('submit button says Send recovery link', async ({ page }) => {
    await expect(page.getByTestId('forgot-password-submit-btn')).toContainText('Send recovery link');
  });

  test('security notice is visible below the form', async ({ page }) => {
    await expect(page.getByTestId('recover-security-notice')).toBeVisible();
  });
});
