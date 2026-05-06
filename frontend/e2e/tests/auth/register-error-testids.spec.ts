// BUG-226: register-page fields should expose errorTestId hooks.
import { test, expect } from '../../fixtures';

test.describe('Register page error testids', () => {
  test('email error renders with stable testid', async ({ page }) => {
    await page.route('**/api/auth/register', (r) => r.fulfill({
      status: 422, contentType: 'application/json',
      body: JSON.stringify({ errors: { email: ['Invalid email address'] } }),
    }));
    await page.goto('/auth/register');
    await page.getByLabel('Display name').fill('Sam');
    await page.getByLabel('Email').fill('not-an-email');
    await page.getByLabel('City').fill('Toronto');
    await page.getByLabel('Password').fill('long-enough-password!');
    await page.getByTestId('register-submit-btn').click();
    await expect(page.getByTestId('register-email-error')).toBeVisible({ timeout: 10000 });
  });
});
