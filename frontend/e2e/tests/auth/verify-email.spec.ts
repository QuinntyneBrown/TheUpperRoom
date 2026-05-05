// T153: verify email error state must match design heading and action
import { test, expect } from '../../fixtures';

test.describe('Verify email error state', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/verify', (route) => {
      route.fulfill({ status: 400, body: '{"message":"invalid"}' });
    });
    await page.goto('/auth/verify?token=bad-token');
    await expect(page.getByTestId('verify-error')).toBeVisible({ timeout: 5000 });
  });

  test('shows correct error heading', async ({ page }) => {
    await expect(page.getByTestId('verify-error-heading')).toContainText("This link can't be used");
  });

  test('shows back to sign-in link', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Back to sign in' })).toBeVisible();
  });
});
