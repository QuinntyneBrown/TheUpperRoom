// BUG-185: verify page success/error states should use h1, not h2,
// since they're the page's primary heading.
import { test, expect } from '../../fixtures';

test.describe('Verify page heading level', () => {
  test('success state title is an h1', async ({ page }) => {
    await page.route('**/api/auth/verify**', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '{}',
    }));
    await page.goto('/auth/verify?token=stub');
    const h = page.getByTestId('verify-success-title');
    await expect(h).toBeVisible({ timeout: 5000 });
    expect(await h.evaluate(el => el.tagName.toLowerCase())).toBe('h1');
  });

  test('error state heading is an h1', async ({ page }) => {
    await page.route('**/api/auth/verify**', (r) => r.fulfill({
      status: 400, contentType: 'application/json', body: '{}',
    }));
    await page.goto('/auth/verify?token=stub');
    const h = page.getByTestId('verify-error-heading');
    await expect(h).toBeVisible({ timeout: 5000 });
    expect(await h.evaluate(el => el.tagName.toLowerCase())).toBe('h1');
  });
});
