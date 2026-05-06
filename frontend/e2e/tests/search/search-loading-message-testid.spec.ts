// BUG-238: search-overlay loading message should have data-testid.
import { test, expect } from '../../fixtures';

test.describe('Search loading message testid', () => {
  test('search-loading-message renders during search', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/search**', async (r) => {
      await new Promise(res => setTimeout(res, 500));
      r.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ contacts: [], partners: [], hackathons: [] }),
      });
    });
    await page.goto('/');
    await page.getByTestId('global-search-trigger').click();
    await page.getByTestId('search-input').fill('sam');
    await expect(page.getByTestId('search-loading-message')).toBeVisible({ timeout: 10000 });
  });
});
