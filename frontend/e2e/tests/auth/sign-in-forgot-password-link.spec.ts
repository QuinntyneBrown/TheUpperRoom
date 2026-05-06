// BUG-195: sign-in "Forgot password?" link lacks a testid.
import { test, expect } from '../../fixtures';

test.describe('Sign-in forgot-password link testid', () => {
  test('renders link with testid sign-in-forgot-password-link', async ({ page }) => {
    await page.goto('/auth/sign-in');
    const link = page.getByTestId('sign-in-forgot-password-link');
    await expect(link).toBeVisible({ timeout: 5000 });
    await expect(link).toHaveText(/Forgot password/);
  });
});
