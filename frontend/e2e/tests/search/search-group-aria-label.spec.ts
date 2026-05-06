// BUG-210: search overlay group ul should have aria-label.
import { test, expect } from '../../fixtures';

test.describe('Search overlay group aria-label', () => {
  test('group ul has aria-label derived from group label', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/search**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        contacts: [{ id: 'c1', label: 'Sam Reyes', type: 'contact' }],
        partners: [],
        hackathons: [],
      }),
    }));
    await page.goto('/');
    await page.getByTestId('global-search-trigger').click();
    await page.getByTestId('search-input').fill('sam');
    const ul = page.locator('ul.search-overlay__group-items').first();
    await expect(ul).toBeVisible({ timeout: 10000 });
    await expect(ul).toHaveAttribute('aria-label', /results/i);
  });
});
