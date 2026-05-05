// T151: sign-in forgot-password link must appear above the submit button
import { test, expect } from '../../fixtures';

test.describe('Sign-in page layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/sign-in');
    await expect(page.getByTestId('sign-in-submit-btn')).toBeVisible({ timeout: 5000 });
  });

  test('Forgot password link appears before the submit button in DOM order', async ({ page }) => {
    const forgotHandle = await page.getByRole('link', { name: 'Forgot password?' }).elementHandle();
    const submitHandle = await page.getByTestId('sign-in-submit-btn').elementHandle();
    // compareDocumentPosition: 4 means "following" — submit follows forgot if forgot is before submit
    const position = await page.evaluate(
      ([forgot, submit]) => forgot!.compareDocumentPosition(submit!),
      [forgotHandle, submitHandle]
    );
    expect(position & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test('sign-in card has subtitle', async ({ page }) => {
    await expect(page.getByTestId('sign-in-subtitle')).toBeVisible();
  });
});
