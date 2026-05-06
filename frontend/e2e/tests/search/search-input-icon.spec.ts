// BUG-037: design frame PmZV6 shows the search input with a
// magnifying-glass icon prefix. Implementation has a plain input.
import { test, expect } from '../../fixtures';

test.describe('Global search input icon', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/dashboards/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ json: JSON.stringify({ items: [] }) }),
    }));
    await page.goto('/dashboard');
    await page.getByTestId('global-search-trigger').click();
    await expect(page.getByTestId('search-overlay')).toBeVisible();
  });

  test('input has a search icon prefix', async ({ page }) => {
    await expect(page.getByTestId('search-input-icon')).toBeVisible();
  });
});
