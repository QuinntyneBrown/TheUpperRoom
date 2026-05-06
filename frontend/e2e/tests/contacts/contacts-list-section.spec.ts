// BUG-305: contacts-list-page wrapper should be section with aria-labelledby.
import { test, expect } from '../../fixtures';

test.describe('Contacts list page section', () => {
  test('wrapper is section with aria-labelledby', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts**', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ rows: [], total: 0 }),
    }));
    await page.goto('/contacts');
    const section = page.locator('section.contacts-list-page');
    await expect(section).toBeVisible({ timeout: 10000 });
    await expect(section).toHaveAttribute('aria-labelledby', 'contacts-list-title');
  });
});
