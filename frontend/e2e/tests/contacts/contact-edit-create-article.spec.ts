// BUG-301: contact-edit and contact-create page wrappers should be articles.
import { test, expect } from '../../fixtures';

test.describe('Contact edit/create article', () => {
  test('contact-edit page-container is article with aria-labelledby', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/c1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'c1', firstName: 'Sam', lastName: 'Reyes',
        email: '', phone: '', city: '', notes: [], version: 1,
      }),
    }));
    await page.goto('/contacts/c1/edit');
    const article = page.locator('article.page-container');
    await expect(article).toBeVisible({ timeout: 10000 });
    await expect(article).toHaveAttribute('aria-labelledby', 'contact-edit-title');
  });
});
