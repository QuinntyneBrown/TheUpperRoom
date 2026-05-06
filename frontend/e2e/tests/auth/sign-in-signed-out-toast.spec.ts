// BUG-102: design frame XnSO6 shows a "You have been signed out"
// toast on the sign-in page after explicit sign out. Implementation
// has no such toast.
import { test, expect } from '../../fixtures';

test.describe('Sign-in signed-out toast', () => {
  test('shows the signed-out toast when ?signedOut=1 is set', async ({ page }) => {
    await page.goto('/auth/sign-in?signedOut=1');
    const toast = page.getByTestId('sign-in-signed-out-toast');
    await expect(toast).toBeVisible({ timeout: 5000 });
    await expect(toast).toContainText(/signed out/i);
  });

  test('does not show the toast on a normal visit', async ({ page }) => {
    await page.goto('/auth/sign-in');
    await expect(page.getByTestId('sign-in-submit-btn')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('sign-in-signed-out-toast')).toHaveCount(0);
  });
});
