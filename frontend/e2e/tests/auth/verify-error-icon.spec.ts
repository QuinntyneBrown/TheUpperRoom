// BUG-022: design frame YDmE0 shows the verify-error state with a
// prominent error icon above the heading. The current implementation
// has the wordmark and heading but no icon (its sibling verify-success
// state already shows check_circle).
import { test, expect } from '../../fixtures';

test.describe('Verify-error state icon', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/verify**', (route) => {
      route.fulfill({ status: 400, body: '{"message":"invalid"}' });
    });
    await page.goto('/auth/verify?token=bad-token');
    await expect(page.getByTestId('verify-error')).toBeVisible({ timeout: 5000 });
  });

  test('shows a link_off mat-icon above the heading', async ({ page }) => {
    const icon = page.getByTestId('verify-error-icon');
    await expect(icon).toBeVisible();
    await expect(icon).toHaveText('link_off');
  });
});
