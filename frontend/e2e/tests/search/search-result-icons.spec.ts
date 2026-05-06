// BUG-035: design frame PmZV6 shows each result row with a per-type
// icon. Implementation shows only the label text.
import { test, expect } from '../../fixtures';

test.describe('Global search result icons', () => {
  test('contact result row shows a contacts mat-icon', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/dashboards/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ json: JSON.stringify({ items: [] }) }),
    }));
    await page.route('**/api/search**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        contacts: [{ id: 'c1', type: 'contact', label: 'Sarah Mensah' }],
        partners: [], hackathons: [], members: [],
      }),
    }));
    await page.goto('/dashboard');
    await page.getByTestId('global-search-trigger').click();
    await page.getByTestId('search-input').fill('sarah');
    await expect(page.getByTestId('search-result-c1')).toBeVisible({ timeout: 5000 });
    await expect(page.getByTestId('search-result-c1').locator('mat-icon')).toBeVisible();
  });
});
