// BUG-291: recover-page auth-cards should be sections.
import { test, expect } from '../../fixtures';

test.describe('Recover page auth-card section', () => {
  test('recover form auth-card is section with aria-labelledby', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    const card = page.locator('section.auth-card').first();
    await expect(card).toBeVisible({ timeout: 10000 });
    await expect(card).toHaveAttribute('aria-labelledby', 'recover-heading');
  });
});
