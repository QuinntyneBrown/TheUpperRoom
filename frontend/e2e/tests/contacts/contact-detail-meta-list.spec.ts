// BUG-267: contact-detail summary meta rows should render in a ul.
import { test, expect } from '../../fixtures';

test.describe('Contact detail meta list semantics', () => {
  test('meta rows render in a ul.contact-detail__meta', async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/c1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'c1', firstName: 'Sam', lastName: 'Reyes',
        email: 'sam@example.com', phone: '555-0100', city: 'Toronto',
        notes: [], version: 1,
      }),
    }));
    await page.goto('/contacts/c1');
    const ul = page.locator('ul.contact-detail__meta');
    await expect(ul).toBeVisible({ timeout: 10000 });
    await expect(ul).toHaveAttribute('aria-label', /contact details/i);
    expect(await ul.locator('li.contact-detail__meta-row').count()).toBe(3);
  });
});
