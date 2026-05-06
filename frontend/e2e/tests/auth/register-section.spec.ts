// BUG-290: register-page auth-cards should be sections with aria-labelledby.
import { test, expect } from '../../fixtures';

test.describe('Register page auth-card section', () => {
  test('register form auth-card is section with aria-labelledby', async ({ page }) => {
    await page.goto('/auth/register');
    const card = page.locator('section.auth-card').first();
    await expect(card).toBeVisible({ timeout: 10000 });
    await expect(card).toHaveAttribute('aria-labelledby', 'register-heading');
  });
});
