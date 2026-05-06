// BUG-292: reset-page auth-card should be a section with aria-labelledby.
import { test, expect } from '../../fixtures';

test.describe('Reset page auth-card section', () => {
  test('reset auth-card is section with aria-labelledby', async ({ page }) => {
    await page.goto('/auth/reset?token=abc');
    const card = page.locator('section.auth-card').first();
    await expect(card).toBeVisible({ timeout: 10000 });
    await expect(card).toHaveAttribute('aria-labelledby', 'reset-heading');
  });
});
