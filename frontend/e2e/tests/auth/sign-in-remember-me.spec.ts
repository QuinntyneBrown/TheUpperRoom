// BUG-001: design frame BNkiY shows a "Remember me" checkbox in the
// auth options row alongside "Forgot password?". This test guards that.
import { test, expect } from '../../fixtures';

test.describe('Sign-in Remember me checkbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/sign-in');
    await expect(page.getByTestId('sign-in-submit-btn')).toBeVisible({ timeout: 5000 });
  });

  test('Remember me checkbox is visible on the sign-in card', async ({ page }) => {
    await expect(page.getByTestId('sign-in-remember-me')).toBeVisible();
  });

  test('Remember me appears before Forgot password in DOM order', async ({ page }) => {
    const rememberHandle = await page.getByTestId('sign-in-remember-me').elementHandle();
    const forgotHandle = await page.getByRole('link', { name: 'Forgot password?' }).elementHandle();
    const position = await page.evaluate(
      ([remember, forgot]) => remember!.compareDocumentPosition(forgot!),
      [rememberHandle, forgotHandle]
    );
    // Node.DOCUMENT_POSITION_FOLLOWING = 4
    expect(position & 4).toBeTruthy();
  });
});
