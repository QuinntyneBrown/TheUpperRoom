// BUG-159: sign-in return-toast dismiss button uses a generic
// "Dismiss" aria-label. Mirrors BUG-158.
import { test, expect } from '../../fixtures';

test.describe('Sign-in return-toast dismiss aria specificity', () => {
  test('return-toast dismiss aria-label includes the toast subject', async ({ page }) => {
    await page.goto('/auth/sign-in?return=/dashboard');
    const toast = page.getByTestId('sign-in-return-toast');
    await expect(toast).toBeVisible({ timeout: 5000 });
    const dismiss = toast.locator('.sign-in-return-toast__dismiss');
    const ariaLabel = await dismiss.getAttribute('aria-label');
    expect(ariaLabel).not.toBe('Dismiss');
    expect(ariaLabel).toMatch(/return|sign[ -]?in/i);
  });
});
