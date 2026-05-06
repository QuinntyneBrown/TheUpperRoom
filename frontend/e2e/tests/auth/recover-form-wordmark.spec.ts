// BUG-096: password-recover form state lacks the brand wordmark.
// recover-success has it (BUG-092 added the title). The form/default
// state should have it too — matches sign-in, register, verify, reset.
import { test, expect } from '../../fixtures';

test.describe('Password-recover form wordmark', () => {
  test('recover form card shows brand wordmark with church icon', async ({ page }) => {
    await page.goto('/password-recovery');

    const heading = page.getByTestId('recover-heading');
    await expect(heading).toBeVisible({ timeout: 10000 });

    const wordmark = page.getByTestId('recover-wordmark');
    await expect(wordmark).toBeVisible();
    await expect(wordmark).toContainText('The Upper Room');
  });
});
