// BUG-262: contacts sort buttons should have data-testid.
import { test, expect } from '../../fixtures';

test.describe('Contacts sort button testids', () => {
  test('firstName and lastName sort buttons have testids', async ({ page }) => {
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
    await expect(page.getByTestId('contacts-sort-firstName-btn')).toBeVisible({ timeout: 10000 });
    await expect(page.getByTestId('contacts-sort-lastName-btn')).toBeVisible();
  });
});
