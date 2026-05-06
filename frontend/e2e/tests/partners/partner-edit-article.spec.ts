// BUG-300: partner-edit wrapper should be article with aria-labelledby.
import { test, expect } from '../../fixtures';

test.describe('Partner edit article', () => {
  test('wrapper is article with aria-labelledby', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/partners/p1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'p1', name: 'Mountain Top Church', city: 'Toronto', stage: 'Lead',
        contacts: [], notes: [], history: [], version: 1,
      }),
    }));
    await page.goto('/partners/p1/edit');
    const article = page.getByTestId('partner-edit');
    await expect(article).toBeVisible({ timeout: 10000 });
    const tag = await article.evaluate(el => el.tagName.toLowerCase());
    expect(tag).toBe('article');
    await expect(article).toHaveAttribute('aria-labelledby', 'partner-edit-heading');
  });
});
