// BUG-189: verify-error body paragraph lacks a testid. Mirrors
// BUG-188 (verify-success body).
import { test, expect } from '../../fixtures';

test.describe('Verify-error body testid', () => {
  test('body paragraph has testid verify-error-body', async ({ page }) => {
    await page.route('**/api/auth/verify**', async (route) => {
      await route.fulfill({ status: 400, contentType: 'application/json', body: '{}' });
    });
    await page.goto('/auth/verify?token=stub');
    await expect(page.getByTestId('verify-error')).toBeVisible({ timeout: 5000 });

    const body = page.getByTestId('verify-error-body');
    await expect(body).toBeVisible();
    await expect(body).toContainText('verification link is expired');
  });
});
