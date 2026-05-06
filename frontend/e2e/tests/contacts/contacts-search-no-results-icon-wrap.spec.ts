// BUG-110: design frame cpRf1 shows the search-off icon in a 96×96
// circular wrapper. Implementation renders the bare mat-icon.
import { test, expect } from '../../fixtures';

test.describe('Contacts search no-results icon wrap', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts**', (r) => {
      const url = new URL(r.request().url());
      if (url.searchParams.get('q')) {
        return r.fulfill({
          status: 200, contentType: 'application/json',
          body: JSON.stringify({ rows: [], total: 0, page: 1, pageSize: 20 }),
        });
      }
      return r.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ rows: [{ id: 'c1', firstName: 'Sam', lastName: 'Reyes', email: 's@x.com', city: 'Toronto' }], total: 1, page: 1, pageSize: 20 }),
      });
    });
    await page.goto('/contacts');
    await expect(page.getByTestId('contact-search-input')).toBeVisible({ timeout: 10000 });
    await page.getByTestId('contact-search-input').fill('xyznotfound');
    await expect(page.getByTestId('search-no-results')).toBeVisible({ timeout: 5000 });
  });

  test('search-off icon is wrapped in a circular bordered container', async ({ page }) => {
    const wrap = page.getByTestId('contacts-search-no-results-icon-wrap');
    await expect(wrap).toBeVisible();

    const box = await wrap.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.width - box!.height)).toBeLessThan(2);

    const radius = await wrap.evaluate(el => getComputedStyle(el).borderRadius);
    expect(radius).toMatch(/9999px|50%/);
  });
});
