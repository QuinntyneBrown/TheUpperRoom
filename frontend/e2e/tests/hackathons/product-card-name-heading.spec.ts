// BUG-214: product-card name should be a heading.
import { test, expect } from '../../fixtures';

test.describe('Product card name heading', () => {
  test('name is rendered as a heading', async ({ page }) => {
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
        products: [{ id: 'p1', name: 'PrayerLink', description: 'A prayer app' }],
        partners: [], history: [], version: 1,
      }),
    }));
    await page.goto('/hackathons/h1');
    const card = page.getByTestId('product-card-p1');
    await expect(card).toBeVisible({ timeout: 10000 });
    const name = card.locator('.product-card__name');
    const tag = await name.evaluate(el => el.tagName.toLowerCase());
    expect(['h2', 'h3']).toContain(tag);
  });
});
