// BUG-023: design frame YDmE0 shows a security alert ("Verification
// link expired" with explanation "For your security, links expire
// after 30 minutes.") on the verify-error state. Current
// implementation has no such alert.
import { test, expect } from '../../fixtures';

test.describe('Verify-error state security alert', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/verify**', (route) => {
      route.fulfill({ status: 400, body: '{"message":"invalid"}' });
    });
    await page.goto('/auth/verify?token=bad-token');
    await expect(page.getByTestId('verify-error')).toBeVisible({ timeout: 5000 });
  });

  test('shows the link-expired security alert', async ({ page }) => {
    const alert = page.getByTestId('verify-error-alert');
    await expect(alert).toBeVisible();
    await expect(alert).toContainText('Verification link expired');
    await expect(alert).toContainText('For your security, links expire after 30 minutes.');
  });
});
