// BUG-158: sign-in toast dismiss buttons use a generic "Dismiss"
// aria-label. Personalize so screen readers announce what's being
// dismissed.
import { test, expect } from '../../fixtures';

test.describe('Sign-in toast dismiss aria-label specificity', () => {
  test('signed-out toast dismiss aria-label includes the toast subject', async ({ page }) => {
    await page.goto('/auth/sign-in?signedOut=1');
    const toast = page.getByTestId('sign-in-signed-out-toast');
    await expect(toast).toBeVisible({ timeout: 5000 });
    const dismiss = toast.locator('.sign-in-signed-out-toast__dismiss');
    const ariaLabel = await dismiss.getAttribute('aria-label');
    expect(ariaLabel).not.toBe('Dismiss');
    expect(ariaLabel).toMatch(/sign(ed)?[ -]out/i);
  });
});
