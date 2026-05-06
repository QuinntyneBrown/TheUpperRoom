// BUG-002: design frame BNkiY shows the sign-in card top with
// "The Upper Room" wordmark + logo (no separate "Sign in" h1).
import { test, expect } from '../../fixtures';

test.describe('Sign-in wordmark', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/sign-in');
    await expect(page.getByTestId('sign-in-submit-btn')).toBeVisible({ timeout: 5000 });
  });

  test('card shows "The Upper Room" wordmark with logo', async ({ page }) => {
    const wordmark = page.getByTestId('sign-in-wordmark');
    await expect(wordmark).toBeVisible();
    await expect(wordmark).toContainText('The Upper Room');
    await expect(wordmark.locator('mat-icon')).toBeVisible();
  });

  test('card does not render a stray "Sign in" heading', async ({ page }) => {
    const card = page.locator('.auth-card');
    await expect(card.locator('h1')).toHaveCount(0);
  });
});
