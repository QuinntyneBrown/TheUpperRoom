// BUG-004: design frames hvMz5/GiGKl/YDmE0 show the verify-email card
// with "The Upper Room" wordmark + logo at the top of every state.
import { test, expect } from '../../fixtures';

test.describe('Verify-email wordmark', () => {
  test('verified state shows "The Upper Room" wordmark with logo', async ({ page }) => {
    await page.route('**/api/auth/verify', (route) => {
      route.fulfill({ status: 200, body: '{}' });
    });
    await page.goto('/auth/verify?token=good-token');
    await expect(page.getByTestId('verify-success')).toBeVisible({ timeout: 5000 });

    const wordmark = page.getByTestId('verify-wordmark');
    await expect(wordmark).toBeVisible();
    await expect(wordmark).toContainText('The Upper Room');
    await expect(wordmark.locator('mat-icon')).toBeVisible();
  });

  test('error state shows "The Upper Room" wordmark with logo', async ({ page }) => {
    await page.route('**/api/auth/verify', (route) => {
      route.fulfill({ status: 400, body: '{"message":"invalid"}' });
    });
    await page.goto('/auth/verify?token=bad-token');
    await expect(page.getByTestId('verify-error')).toBeVisible({ timeout: 5000 });

    const wordmark = page.getByTestId('verify-wordmark');
    await expect(wordmark).toBeVisible();
    await expect(wordmark).toContainText('The Upper Room');
    await expect(wordmark.locator('mat-icon')).toBeVisible();
  });
});
