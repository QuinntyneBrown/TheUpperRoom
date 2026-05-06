// BUG-354: sign-in-page signup-prompt "New to The Upper Room?" span
// lacks a testid mirroring recover-footer-prompt and register-footer-prompt.
import { test, expect } from '../../fixtures';

test.describe('Sign-in signup-prompt testid', () => {
  test('signup prompt exposes testid', async ({ page }) => {
    await page.goto('/auth/sign-in');
    await expect(page.getByTestId('sign-in-signup-prompt')).toBeVisible();
    await expect(page.getByTestId('sign-in-signup-prompt')).toHaveText(/new to the upper room/i);
  });
});
