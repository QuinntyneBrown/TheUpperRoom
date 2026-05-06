// BUG-014: design frame Zu6hB shows the recover-success state with a
// helper paragraph about the 30-minute link expiry and the spam folder.
// Current implementation has only the heading, generic subtitle, and
// "Back to sign in" link — no helper text.
import { test, expect } from '../../fixtures';

test.describe('Recover success help text', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/recover', (route) => {
      route.fulfill({ status: 200, body: '{}' });
    });
    await page.goto('/auth/forgot-password');
    await expect(page.getByTestId('forgot-password-submit-btn')).toBeVisible({ timeout: 5000 });
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByTestId('forgot-password-submit-btn').click();
    await expect(page.getByTestId('recover-success')).toBeVisible({ timeout: 5000 });
  });

  test('shows the link-expiry / spam-folder note', async ({ page }) => {
    await expect(page.getByTestId('recover-success-help')).toHaveText(
      "The link expires in 30 minutes. Check your spam folder if you don't see it."
    );
  });
});
