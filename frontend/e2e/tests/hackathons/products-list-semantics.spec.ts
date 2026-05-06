// BUG-215: products-section list should be a ul with li rows.
import { test, expect } from '../../fixtures';

test.describe('Products list semantics', () => {
  test('products render in a <ul aria-label> with <li> rows', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'h1', title: 'Spring', hostCity: 'Toronto',
        startDate: '2026-05-01', endDate: '2026-05-03',
        stage: 'Develop',
        products: [
          { id: 'p1', name: 'PrayerLink' },
          { id: 'p2', name: 'TeamMate' },
        ],
        partners: [], history: [], version: 1,
      }),
    }));
    await page.goto('/hackathons/h1');
    const ul = page.locator('ul.products-section__list');
    await expect(ul).toBeVisible({ timeout: 10000 });
    await expect(ul).toHaveAttribute('aria-label', /products/i);
    expect(await ul.locator('li.product-card').count()).toBe(2);
  });
});
