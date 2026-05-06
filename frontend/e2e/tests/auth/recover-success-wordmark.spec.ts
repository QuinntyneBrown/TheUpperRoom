// BUG-015: design frame Zu6hB shows the recover-success card with
// "The Upper Room" wordmark + church logo at the top. The current
// implementation has no wordmark on the success state.
import { test, expect } from '../../fixtures';

test.describe('Recover success wordmark', () => {
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

  test('shows "The Upper Room" wordmark with logo', async ({ page }) => {
    const wordmark = page.getByTestId('recover-success-wordmark');
    await expect(wordmark).toBeVisible();
    await expect(wordmark).toContainText('The Upper Room');
    await expect(wordmark.locator('mat-icon')).toBeVisible();
  });
});
