// BUG-013: design frame y1VvT shows the recover footer as
// "Remembered it? Back to sign in" — current implementation has only
// the bare "Back to sign in" link.
import { test, expect } from '../../fixtures';

test.describe('Recover page footer prompt', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/forgot-password');
    await expect(page.getByTestId('forgot-password-submit-btn')).toBeVisible({ timeout: 5000 });
  });

  test('footer reads "Remembered it?" before the sign-in link', async ({ page }) => {
    await expect(page.getByTestId('recover-footer-prompt')).toHaveText('Remembered it?');
  });
});
