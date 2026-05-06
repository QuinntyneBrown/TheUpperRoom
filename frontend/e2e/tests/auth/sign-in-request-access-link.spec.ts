// BUG-194: sign-in "Request access" link lacks a testid. Mirrors
// the cross-page testid convention.
import { test, expect } from '../../fixtures';

test.describe('Sign-in request-access link testid', () => {
  test('link has testid sign-in-request-access-link', async ({ page }) => {
    await page.goto('/auth/sign-in');
    const link = page.getByTestId('sign-in-request-access-link');
    await expect(link).toBeVisible({ timeout: 5000 });
    await expect(link).toHaveText(/Request access/);
  });
});
