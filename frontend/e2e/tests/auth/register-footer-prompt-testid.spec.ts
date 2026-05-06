// BUG-247: register-page footer "Already have an account?" prompt
// text lacks a testid while the equivalent recover-page footer prompt
// uses recover-footer-prompt.
import { test, expect } from '../../fixtures';

test.describe('Register footer prompt testid', () => {
  test('footer prompt has testid register-footer-prompt', async ({ page }) => {
    await page.goto('/auth/register');
    await expect(page.getByTestId('register-footer-prompt')).toBeVisible();
    await expect(page.getByTestId('register-footer-prompt')).toHaveText(/already have an account/i);
  });
});
