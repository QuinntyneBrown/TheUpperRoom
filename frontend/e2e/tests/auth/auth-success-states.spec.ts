// Traces to: Auth pages — success confirmation states
// T60: forgot-password and register success states have data-testid
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Auth success confirmation states', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('forgot password shows success confirmation after submission', async ({ page }) => {
    await page.route('**/api/auth/forgot-password', (route) => {
      route.fulfill({ status: 204 });
    });

    await page.goto('/auth/forgot-password');
    await page.locator('ur-input[label="Email"] input').fill('user@example.com');
    await page.locator('ur-button[type="submit"] button').click();

    await expect(page.getByTestId('recover-success')).toBeVisible({ timeout: 3000 });
  });

  test('register shows success confirmation after submission', async ({ page }) => {
    await page.route('**/api/auth/register', (route) => {
      route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ id: '1' }) });
    });

    await page.goto('/auth/register');
    await page.locator('ur-input[label="Display name"] input').fill('Alice Smith');
    await page.locator('ur-input[label="Email"] input').fill('alice@example.com');
    await page.locator('ur-input[label="Password"] input').fill('SecurePass1!');
    await page.locator('ur-input[label="City"] input').fill('Toronto');
    await page.locator('ur-button[type="submit"] button').click();

    await expect(page.getByTestId('register-success')).toBeVisible({ timeout: 3000 });
  });
});
