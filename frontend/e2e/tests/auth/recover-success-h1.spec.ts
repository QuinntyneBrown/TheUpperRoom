// BUG-186: recover-success "Check your inbox" should be an h1.
import { test, expect } from '../../fixtures';

test.describe('Recover success h1', () => {
  test('Check your inbox is an h1', async ({ page }) => {
    await page.route('**/api/auth/recover**', async (route) => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
    });
    await page.goto('/auth/recover');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByTestId('forgot-password-submit-btn').click();
    const h = page.getByTestId('recover-success-title');
    await expect(h).toBeVisible({ timeout: 5000 });
    expect(await h.evaluate(el => el.tagName.toLowerCase())).toBe('h1');
  });
});
