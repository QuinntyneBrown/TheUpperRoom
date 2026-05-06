// BUG-175: contact-detail breadcrumb is a div. WAI-ARIA pattern
// requires a <nav aria-label="Breadcrumb"> wrapper.
import { test, expect } from '../../fixtures';

test.describe('Contact-detail breadcrumb landmark', () => {
  test('breadcrumb is a nav with aria-label', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/c1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'c1', teamId: 't1', firstName: 'Sam', lastName: 'Reyes', version: 1, notes: [],
      }),
    }));
    await page.goto('/contacts/c1');
    const breadcrumb = page.locator('nav.contact-detail__breadcrumb');
    await expect(breadcrumb).toBeVisible({ timeout: 10000 });
    await expect(breadcrumb).toHaveAttribute('aria-label', /breadcrumb/i);
    await expect(breadcrumb.locator('[aria-current="page"]')).toBeVisible();
  });
});
