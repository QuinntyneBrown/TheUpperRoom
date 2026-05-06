// BUG-295: hackathon-detail wrapper should be an article with aria-labelledby.
import { test, expect } from '../../fixtures';

test.describe('Hackathon detail article', () => {
  test('wrapper is an article with aria-labelledby to h1', async ({ page }) => {
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
    const article = page.getByTestId('hackathon-detail');
    await expect(article).toBeVisible({ timeout: 10000 });
    const tag = await article.evaluate(el => el.tagName.toLowerCase());
    expect(tag).toBe('article');
    await expect(article).toHaveAttribute('aria-labelledby', 'hackathon-title');
  });
});
