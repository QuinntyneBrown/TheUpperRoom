// BUG-298: global-team-detail wrapper should be article with aria-labelledby.
import { test, expect } from '../../fixtures';

test.describe('Global team detail article', () => {
  test('wrapper is article with aria-labelledby', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['NationalLead'] }),
    }));
    await page.route('**/api/teams/t1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 't1', city: 'Toronto', memberCount: 5,
        activeHackathonCount: 2, partnerCount: 3,
      }),
    }));
    await page.goto('/teams/t1');
    const article = page.getByTestId('global-team-detail');
    await expect(article).toBeVisible({ timeout: 10000 });
    const tag = await article.evaluate(el => el.tagName.toLowerCase());
    expect(tag).toBe('article');
    await expect(article).toHaveAttribute('aria-labelledby', 'global-team-city');
  });
});
