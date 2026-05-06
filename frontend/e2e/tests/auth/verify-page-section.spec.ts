// BUG-288: verify-page auth-cards should be section with aria-labelledby.
import { test, expect } from '../../fixtures';

test.describe('Verify page auth-card section', () => {
  test('verify-error is a section with aria-labelledby', async ({ page }) => {
    await page.route('**/api/auth/verify**', (r) => r.fulfill({ status: 400, body: '' }));
    await page.goto('/auth/verify?token=bad');
    const card = page.getByTestId('verify-error');
    await expect(card).toBeVisible({ timeout: 10000 });
    const tag = await card.evaluate(el => el.tagName.toLowerCase());
    expect(tag).toBe('section');
    await expect(card).toHaveAttribute('aria-labelledby', 'verify-error-heading');
  });
});
