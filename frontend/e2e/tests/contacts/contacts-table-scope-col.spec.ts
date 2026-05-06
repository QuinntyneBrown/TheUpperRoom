// BUG-265: contacts-table headers should have scope="col".
import { test, expect } from '../../fixtures';

test.describe('Contacts table scope', () => {
  test('all column headers have scope="col"', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        rows: [{ id: 'c1', firstName: 'Sam', lastName: 'Reyes', email: 'sam@example.com', city: 'Toronto' }],
        total: 1,
      }),
    }));
    await page.goto('/contacts');
    const headers = page.locator('table.contacts-table thead th');
    await expect(headers).toHaveCount(4, { timeout: 10000 });
    const scopes = await headers.evaluateAll(els => els.map(el => el.getAttribute('scope')));
    expect(scopes.every(s => s === 'col')).toBe(true);
  });
});
