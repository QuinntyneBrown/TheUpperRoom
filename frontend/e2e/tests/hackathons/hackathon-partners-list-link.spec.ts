// BUG-180: hackathon-detail partners list shows partner names as
// plain text. Each partner should be a routerLink to the partner
// detail page so users can navigate from a hackathon's partners.
import { test, expect } from '../../fixtures';

test.describe('Hackathon-detail partners list link', () => {
  test('partner name is a link to /partners/{id}', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'h1', title: 'Spring Hack', startsOn: '2026-05-01', endsOn: '2026-05-03',
        hostCity: 'Toronto',
        partners: [{ id: 'p1', name: 'Mountain Top', city: 'Toronto' }],
        products: [], history: [], version: 1,
      }),
    }));
    await page.goto('/hackathons/h1');
    await expect(page.getByTestId('hackathon-detail')).toBeVisible({ timeout: 10000 });

    const item = page.locator('.hackathon-partners__item').first();
    const link = item.locator('a').first();
    await expect(link).toBeVisible();
    const href = await link.getAttribute('href');
    expect(href).toBe('/partners/p1');
  });
});
