// BUG-239: design frames Zu6hB (desktop) and ph9B9 (mobile) show the
// recover-success state with an email confirmation row displaying the
// address the user just submitted. Implementation has no email row.
import { test, expect } from '../../fixtures';

test.describe('Recover success email row', () => {
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

  test('shows the submitted email address', async ({ page }) => {
    await expect(page.getByTestId('recover-success-email-row')).toBeVisible();
    await expect(page.getByTestId('recover-success-email-value')).toHaveText('user@example.com');
  });
});
