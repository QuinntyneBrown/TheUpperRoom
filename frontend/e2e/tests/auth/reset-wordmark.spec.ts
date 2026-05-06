// BUG-095: password-reset page (default state) is missing the brand
// wordmark that every other auth card (sign-in, register, verify,
// recover-success) shows. Add the same wordmark block.
import { test, expect } from '../../fixtures';

test.describe('Password-reset wordmark', () => {
  test('reset card shows brand wordmark with church icon', async ({ page }) => {
    await page.goto('/password-reset?token=abc');

    const heading = page.getByTestId('reset-heading');
    await expect(heading).toBeVisible({ timeout: 10000 });

    const wordmark = page.getByTestId('reset-wordmark');
    await expect(wordmark).toBeVisible();
    await expect(wordmark).toContainText('The Upper Room');
  });
});
