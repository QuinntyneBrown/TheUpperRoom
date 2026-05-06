// BUG-188: reset page error renders as a plain string. Convert to
// ur-alert. Mirrors BUG-103.
import { test, expect } from '../../fixtures';

test.describe('Reset page error alert', () => {
  test('renders danger alert with title + body when reset fails', async ({ page }) => {
    await page.route('**/api/auth/reset-password**', async (route) => {
      await route.fulfill({ status: 400, contentType: 'application/json', body: '{}' });
    });
    await page.goto('/auth/reset-password?token=stub&email=q@test.com');
    await page.getByTestId('reset-new-password-input').locator('input').fill('strongpass');
    await page.getByTestId('reset-confirm-password-input').locator('input').fill('strongpass');
    await page.getByTestId('reset-password-submit-btn').click();
    const alert = page.getByTestId('reset-error');
    await expect(alert).toBeVisible({ timeout: 5000 });
    await expect(alert).toContainText(/This link can't be used/);
    await expect(alert).toContainText(/expired or has already been used/);
  });
});
