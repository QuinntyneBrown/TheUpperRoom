// BUG-302: hackathon-edit-page wrapper should be article with aria-labelledby.
import { test, expect } from '../../fixtures';

test.describe('Hackathon edit article', () => {
  test('wrapper is article with aria-labelledby', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners', (r) => r.fulfill({
      status: 200, contentType: 'application/json', body: '[]',
    }));
    await page.route('**/api/hackathons/h1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'h1', title: 'Spring', hostCity: 'Toronto',
        startDate: '2026-05-01', endDate: '2026-05-03',
        stage: 'Discover', products: [], partners: [], history: [], version: 1,
      }),
    }));
    await page.goto('/hackathons/h1/edit');
    const article = page.locator('article.hackathon-edit-page');
    await expect(article).toBeVisible({ timeout: 10000 });
    await expect(article).toHaveAttribute('aria-labelledby', 'hackathon-edit-title');
  });
});
