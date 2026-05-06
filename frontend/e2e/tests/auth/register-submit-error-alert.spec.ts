// BUG-189: register submit-error renders as a plain div + icon span.
// Convert to ur-alert with title + body.
import { test, expect } from '../../fixtures';

test.describe('Register submit error alert', () => {
  test('renders danger alert with title + body when register fails', async ({ page }) => {
    await page.route('**/api/auth/register**', async (route) => {
      await route.fulfill({ status: 500, contentType: 'application/json', body: '{}' });
    });
    await page.goto('/auth/register');
    await page.getByLabel(/display name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/city/i).fill('Toronto');
    await page.getByLabel(/password/i).fill('Strong-Pass-1234!');
    await page.getByTestId('register-submit-btn').click();
    const alert = page.getByTestId('register-submit-error');
    await expect(alert).toBeVisible({ timeout: 5000 });
    await expect(alert).toContainText(/Registration failed/);
    await expect(alert).toContainText(/Please try again/);
  });
});
