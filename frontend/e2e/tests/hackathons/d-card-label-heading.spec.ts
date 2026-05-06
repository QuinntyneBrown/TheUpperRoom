// BUG-271: 4 D's stage label should be a heading.
import { test, expect } from '../../fixtures';

test.describe('4 Ds stage label heading', () => {
  test('d-card label is rendered as a heading', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'h1', title: 'Spring', hostCity: 'Toronto',
        startDate: '2026-05-01', endDate: '2026-05-03', stage: 'Discover',
        products: [], partners: [], history: [], version: 1,
      }),
    }));
    await page.goto('/hackathons/h1');
    const label = page.locator('.d-card__label').first();
    await expect(label).toBeVisible({ timeout: 10000 });
    const tag = await label.evaluate(el => el.tagName.toLowerCase());
    expect(['h2', 'h3', 'h4']).toContain(tag);
  });
});
