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
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByTestId('forgot-password-submit-btn').click();

    await expect(page.getByTestId('recover-success')).toBeVisible({ timeout: 3000 });
  });

  test('register shows success confirmation after submission', async ({ page }) => {
    await page.route('**/api/auth/register', (route) => {
      route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ id: '1' }) });
    });

    await page.goto('/auth/register');
    await page.getByLabel('Display name').fill('Alice Smith');
    await page.getByLabel('Email').fill('alice@example.com');
    await page.getByLabel('Password').fill('SecurePass1!');
    await page.getByLabel('City').fill('Toronto');
    await page.getByTestId('register-submit-btn').click();

    await expect(page.getByTestId('register-success')).toBeVisible({ timeout: 3000 });
  });
});
