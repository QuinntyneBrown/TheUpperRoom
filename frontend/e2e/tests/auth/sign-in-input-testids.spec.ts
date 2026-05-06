// BUG-345: sign-in-page email/password ur-input fields lack
// inputTestId mirroring BUG-342/343/344.
import { test, expect } from '../../fixtures';

test.describe('Sign-in input testids', () => {
  test('form input fields expose testids', async ({ page }) => {
    await page.goto('/auth/sign-in');
    await expect(page.getByTestId('sign-in-email-input')).toBeVisible();
    await expect(page.getByTestId('sign-in-password-input')).toBeVisible();
  });
});
