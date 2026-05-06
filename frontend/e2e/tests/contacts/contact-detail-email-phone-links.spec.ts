// BUG-130: contact-detail email and phone are plain spans. Convert
// to mailto:/tel: links so users can tap-to-mail or tap-to-call.
import { test, expect } from '../../fixtures';

test.describe('Contact detail email and phone links', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/auth/me', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({ id: '1', email: 'q@test.com', displayName: 'Quinn', roles: ['CityLead'] }),
    }));
    await page.route('**/api/contacts/c1', (r) => r.fulfill({
      status: 200, contentType: 'application/json',
      body: JSON.stringify({
        id: 'c1', teamId: 't1', firstName: 'Sam', lastName: 'Reyes',
        email: 'sam@example.com', phone: '+14165550188', city: 'Toronto',
        version: 1, notes: [],
      }),
    }));
    await page.goto('/contacts/c1');
    await expect(page.getByTestId('contact-detail')).toBeVisible({ timeout: 10000 });
  });

  test('email row links to mailto:', async ({ page }) => {
    const link = page.getByTestId('contact-meta-email').locator('a');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', 'mailto:sam@example.com');
  });

  test('phone row links to tel:', async ({ page }) => {
    const link = page.getByTestId('contact-meta-phone').locator('a');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', 'tel:+14165550188');
  });
});
