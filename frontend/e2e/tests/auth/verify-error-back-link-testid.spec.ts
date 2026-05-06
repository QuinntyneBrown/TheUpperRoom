// BUG-173: verify-error back link lacks a data-testid.
import { test, expect } from '../../fixtures';

test.describe('Verify-error back-link testid', () => {
  test('renders back link with data-testid="verify-error-back-link"', async ({ page }) => {
    await page.route('**/api/auth/verify**', (route) => {
      route.fulfill({ status: 400, body: '{}', contentType: 'application/json' });
    });
    await page.goto('/auth/verify?token=stub');
    await expect(page.getByTestId('verify-error')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('verify-error-back-link')).toBeVisible();
  });
});
