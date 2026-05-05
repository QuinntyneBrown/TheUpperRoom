// Traces to: T63 — create pages navigate with ?saved=1 so detail shows savedToast
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Contact create saved toast', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('navigating to detail with ?saved=1 shows saved toast', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const contact = {
      id: 'c-saved1', firstName: 'Toast', lastName: 'Create',
      email: '', phone: '', city: '', notes: [], deletedAt: null,
    };
    await page.route('**/api/contacts/c-saved1', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(contact) });
      } else { route.continue(); }
    });

    await page.goto('/contacts/c-saved1?saved=1');
    await expect(page.getByTestId('contact-detail')).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('contact-saved-toast')).toBeVisible({ timeout: 2000 });
  });

  test('saved toast disappears after a few seconds', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const contact = {
      id: 'c-saved2', firstName: 'Toast', lastName: 'Fade',
      email: '', phone: '', city: '', notes: [], deletedAt: null,
    };
    await page.route('**/api/contacts/c-saved2', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(contact) });
      } else { route.continue(); }
    });

    await page.goto('/contacts/c-saved2?saved=1');
    await expect(page.getByTestId('contact-saved-toast')).toBeVisible({ timeout: 2000 });
    await expect(page.getByTestId('contact-saved-toast')).not.toBeVisible({ timeout: 5000 });
  });
});
