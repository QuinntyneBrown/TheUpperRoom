// BUG-289: sign-in auth-card should be section with aria-labelledby.
import { test, expect } from '../../fixtures';

test.describe('Sign-in auth-card section', () => {
  test('auth-card is a section with aria-labelledby', async ({ page }) => {
    await page.goto('/auth/sign-in');
    const card = page.locator('section.auth-card').first();
    await expect(card).toBeVisible({ timeout: 10000 });
    await expect(card).toHaveAttribute('aria-labelledby', 'sign-in-heading');
  });
});
