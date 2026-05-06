// BUG-032: design frame Zu6hB shows the recover-success subtitle as
// "If an account exists for that address, we have sent reset
// instructions to it." Current implementation reads "If the email is
// registered, a reset link has been sent."
import { test, expect } from '../../fixtures';

test.describe('Recover success subtitle copy', () => {
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

  test('subtitle matches the design copy', async ({ page }) => {
    await expect(page.getByTestId('recover-success-subtitle')).toHaveText(
      'If an account exists for that address, we have sent reset instructions to it.'
    );
  });
});
