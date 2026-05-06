// BUG-205: contacts search results ul should have aria-label.
import { test, expect } from '../../fixtures';

test.describe('Contacts search results aria-label', () => {
  test('search results ul has aria-label', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/search**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([
        { id: 'c1', firstName: 'Sam', lastName: 'Reyes', city: 'Toronto' },
      ]),
    }));
    await page.route('**/api/contacts**', (r) => {
      if (r.request().url().includes('/search')) return;
      r.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ rows: [], total: 0 }),
      });
    });
    await page.goto('/contacts');
    await page.getByTestId('contact-search-input').fill('Sam');
    const ul = page.getByTestId('search-results-list');
    await expect(ul).toBeVisible({ timeout: 10000 });
    await expect(ul).toHaveAttribute('aria-label', /search results/i);
  });
});
