// BUG-137: contacts list table last-name cell is plain text. Link it
// to the contact detail like first-name does.
import { test, expect } from '../../fixtures';

test.describe('Contacts list last-name link', () => {
  test('last-name cell renders an anchor to the contact detail', async ({ page }) => {
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
    const row = page.getByTestId('contact-card-c1');
    await expect(row).toBeVisible({ timeout: 10000 });
    const nameLinks = row.locator('a[href$="/contacts/c1"]');
    expect(await nameLinks.count()).toBeGreaterThanOrEqual(2);
  });
});
