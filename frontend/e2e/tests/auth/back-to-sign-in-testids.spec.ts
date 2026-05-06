// BUG-192: register-success has testid="register-success-back-link"
// but recover-success, recover-form, and verify-error "Back to sign
// in" links don't. Make consistent.
import { test, expect } from '../../fixtures';

test.describe('Auth back-to-sign-in testids', () => {
  test('recover-success back link has testid', async ({ page }) => {
    await page.route('**/api/auth/recover**', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });
    await page.goto('/auth/recover');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByTestId('forgot-password-submit-btn').click();
    await expect(page.getByTestId('recover-success-back-link')).toBeVisible({ timeout: 5000 });
  });

  test('recover-form back link has testid', async ({ page }) => {
    await page.goto('/auth/recover');
    await expect(page.getByTestId('recover-form-back-link')).toBeVisible({ timeout: 5000 });
  });

  test('verify-error back link has testid', async ({ page }) => {
    await page.route('**/api/auth/verify**', async (route) => {
      await route.fulfill({ status: 400, contentType: 'application/json', body: '{}' });
    });
    await page.goto('/auth/verify?token=stub');
    await expect(page.getByTestId('verify-error-back-link')).toBeVisible({ timeout: 5000 });
  });
});
