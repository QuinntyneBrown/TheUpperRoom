// BUG-248: reset-page lacks a "Back to sign in" link while sibling
// recover-page and verify-page error/success cards expose one as a way
// out of the auth flow.
import { test, expect } from '../../fixtures';

test.describe('Reset page back to sign in link', () => {
  test('shows Back to sign in link', async ({ page }) => {
    await page.goto('/auth/password-reset?token=x&email=u@example.com');
    await expect(page.getByTestId('reset-back-link')).toBeVisible();
    await expect(page.getByTestId('reset-back-link')).toHaveText(/back to sign in/i);
  });
});
