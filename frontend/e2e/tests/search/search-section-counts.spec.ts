// BUG-036: design frame PmZV6 shows each section label with a count
// next to it (e.g. "CONTACTS 2 results"). Implementation shows only
// the label.
import { test, expect } from '../../fixtures';

test.describe('Global search section counts', () => {
  test('section header shows result count', async ({ page }) => {
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
        contacts: [
          { id: 'c1', type: 'contact', label: 'Sarah Mensah' },
          { id: 'c2', type: 'contact', label: 'Sarah Okonkwo' },
        ],
        partners: [{ id: 'p1', type: 'partner', label: 'Hope City Church' }],
        hackathons: [], members: [],
      }),
    }));
    await page.goto('/dashboard');
    await page.getByTestId('global-search-trigger').click();
    await page.getByTestId('search-input').fill('sarah');
    await expect(page.getByTestId('search-results')).toBeVisible({ timeout: 5000 });

    await expect(page.getByTestId('section-count-Contacts')).toContainText('2');
    await expect(page.getByTestId('section-count-Partners')).toContainText('1');
  });
});
