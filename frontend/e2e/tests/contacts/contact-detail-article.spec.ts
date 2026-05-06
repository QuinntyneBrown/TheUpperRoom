// BUG-297: contact-detail wrapper should be article with aria-labelledby.
import { test, expect } from '../../fixtures';

test.describe('Contact detail article', () => {
  test('wrapper is article with aria-labelledby', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/c1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'c1', firstName: 'Sam', lastName: 'Reyes',
        email: 'sam@example.com', notes: [], version: 1,
      }),
    }));
    await page.goto('/contacts/c1');
    const article = page.getByTestId('contact-detail');
    await expect(article).toBeVisible({ timeout: 10000 });
    const tag = await article.evaluate(el => el.tagName.toLowerCase());
    expect(tag).toBe('article');
    await expect(article).toHaveAttribute('aria-labelledby', 'contact-summary-name');
  });
});
