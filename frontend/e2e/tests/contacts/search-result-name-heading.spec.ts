// BUG-268: contact search result name should be a heading.
import { test, expect } from '../../fixtures';

test.describe('Contact search result name heading', () => {
  test('result name is a heading element', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/search**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify([{ id: 'c1', firstName: 'Sam', lastName: 'Reyes', city: 'Toronto' }]),
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
    const name = page.locator('.contact-result-card__name').first();
    await expect(name).toBeVisible({ timeout: 10000 });
    const tag = await name.evaluate(el => el.tagName.toLowerCase());
    expect(['h2', 'h3', 'h4']).toContain(tag);
  });
});
