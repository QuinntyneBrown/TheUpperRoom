// BUG-064: contacts table sortable th cells lack aria-sort. Sortable
// columns should expose aria-sort="ascending|descending|none" so
// screen readers announce the sort state.
import { test, expect } from '../../fixtures';

test.describe('Contacts table aria-sort', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        rows: [{ id: 'c1', firstName: 'Sam', lastName: 'Reyes', email: 's@x.com', city: 'Toronto' }],
        total: 1, page: 1, pageSize: 20,
      }),
    }));
    await page.goto('/contacts');
    await expect(page.getByTestId('contacts-table')).toBeVisible({ timeout: 10000 });
  });

  test('default sort: First name th has aria-sort="ascending"', async ({ page }) => {
    const th = page.locator('th').filter({ hasText: 'First name' });
    await expect(th).toHaveAttribute('aria-sort', 'ascending');
  });

  test('non-active column has aria-sort="none"', async ({ page }) => {
    const th = page.locator('th').filter({ hasText: 'Last name' });
    await expect(th).toHaveAttribute('aria-sort', 'none');
  });
});
