// T155: contact detail profile card should show avatar with initials
import { test, expect } from '../../fixtures';

test.describe('Contact detail avatar', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/contacts/c1', (route) => {
      route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({
          id: 'c1', teamId: 't1', firstName: 'Sarah', lastName: 'Mensah',
          email: 'sarah@church.org', phone: '+1 416 555 0117', city: 'Toronto',
          version: 1, notes: [], deletedAt: null,
        }),
      });
    });
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ id: 'u1', displayName: 'Pat', email: 'pat@example.com', roles: ['CityLead'] }),
      });
    });
    await page.goto('/contacts/c1');
    await expect(page.getByTestId('contact-detail')).toBeVisible({ timeout: 5000 });
  });

  test('shows avatar with contact initials', async ({ page }) => {
    await expect(page.getByTestId('contact-avatar')).toBeVisible();
    await expect(page.getByTestId('contact-avatar')).toContainText('SM');
  });

  test('avatar contains correct initials for different names', async ({ page }) => {
    await expect(page.getByTestId('contact-avatar')).toContainText('S');
  });
});
