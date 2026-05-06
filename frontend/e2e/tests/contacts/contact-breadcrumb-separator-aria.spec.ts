// BUG-157: contact-detail breadcrumb separator "/" is announced by
// screen readers because it lacks aria-hidden. Decorative.
import { test, expect } from '../../fixtures';

test.describe('Contact breadcrumb separator aria', () => {
  test('"/" separator is aria-hidden', async ({ page }) => {
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
    await expect(page.getByTestId('contact-detail')).toBeVisible({ timeout: 10000 });

    const sep = page.locator('.contact-detail__breadcrumb-sep');
    await expect(sep).toBeVisible();
    await expect(sep).toHaveAttribute('aria-hidden', 'true');
  });
});
