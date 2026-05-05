// Traces to: Admin deleted pages — empty states with icons
// T50: deleted contacts and hackathons show icon when empty
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Admin deleted pages empty states', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('deleted contacts page shows icon when empty', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/contacts/deleted', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      } else {
        route.continue();
      }
    });

    await page.goto('/admin/contacts/deleted');
    await expect(page.getByTestId('deleted-contacts-empty')).toBeVisible({ timeout: 3000 });
  });

  test('deleted hackathons page shows icon when empty', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/hackathons/deleted', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      } else {
        route.continue();
      }
    });

    await page.goto('/admin/hackathons/deleted');
    await expect(page.getByTestId('deleted-hackathons-empty')).toBeVisible({ timeout: 3000 });
  });
});
