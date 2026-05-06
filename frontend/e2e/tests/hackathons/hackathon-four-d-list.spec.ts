// BUG-201: 4 D's stage cards should render as <ol><li>.
import { test, expect } from '../../fixtures';

test.describe('Hackathon 4 D\'s list semantics', () => {
  test('4 D\'s stages render in an <ol> with <li> entries', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'h1', title: 'Spring Hackathon', hostCity: 'Toronto',
        startDate: '2026-05-01', endDate: '2026-05-03',
        stage: 'Discover', products: [], partners: [], version: 1,
      }),
    }));
    await page.goto('/hackathons/h1');
    const ol = page.locator('ol.four-d-cards');
    await expect(ol).toBeVisible({ timeout: 10000 });
    await expect(ol).toHaveAttribute('aria-label', /4 D/i);
    expect(await ol.locator('li.d-card').count()).toBe(4);
  });
});
