// BUG-072: design frame r6sAM shows the contacts-list search input
// with a magnifying-glass icon prefix; implementation has no icon.
// Mirrors BUG-037 (global-search overlay).
import { test, expect } from '../../fixtures';

test.describe('Contacts-list search icon prefix', () => {
  test('search input has a magnifying-glass icon prefix', async ({ page }) => {
    await page.route('**/api/contacts*', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: [], total: 0 }),
    }));
    await page.goto('/contacts');
    await expect(page.getByTestId('contact-search-input')).toBeVisible({ timeout: 10000 });

    const icon = page.getByTestId('contact-search-icon');
    await expect(icon).toBeVisible();
    await expect(icon).toHaveText('search');
  });
});
