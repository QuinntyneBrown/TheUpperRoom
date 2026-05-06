// BUG-193: register-page footer "Sign in" link lacks a testid while
// peer auth back-links use them.
import { test, expect } from '../../fixtures';

test.describe('Register footer sign-in link testid', () => {
  test('renders link with testid register-footer-sign-in-link', async ({ page }) => {
    await page.goto('/auth/register');
    const link = page.getByTestId('register-footer-sign-in-link');
    await expect(link).toBeVisible({ timeout: 5000 });
    await expect(link).toHaveText(/Sign in/);
  });
});
