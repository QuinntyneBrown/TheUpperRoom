// Traces to: Contact Detail - Delete Permission Denied
// L2-031: delete button disabled and info banner for roles without contacts.delete
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Contact delete permission denied state', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('user without delete permission sees disabled delete button and info banner', async ({ auth, contacts, page }) => {
    await auth.signInAs('city-lead');
    await contacts.create({ name: 'Permission Test Contact' });

    await page.route('**/api/auth/me', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'test-user', email: 'prayer@test.com', displayName: 'Prayer Lead', roles: ['PrayerLead'] }),
      });
    });

    await page.reload();
    await expect(page.getByTestId('delete-permission-denied-banner')).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('contact-delete-btn')).toBeDisabled();
  });

  test('city-lead sees enabled delete button (no banner)', async ({ auth, contacts, page }) => {
    await auth.signInAs('city-lead');
    await contacts.create({ name: 'CityLead Delete Test' });
    await expect(page.getByTestId('delete-permission-denied-banner')).not.toBeVisible();
    await expect(page.getByTestId('contact-delete-btn').first()).toBeEnabled();
  });
});
