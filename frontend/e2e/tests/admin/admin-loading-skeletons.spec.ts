// Traces to: Admin deleted pages — skeleton loading states
// T52: deleted contacts and hackathons show skeleton rows while loading
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Admin deleted pages loading skeletons', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('deleted contacts page shows skeleton while loading', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    let resolveHold!: () => void;
    const hold = new Promise<void>((resolve) => { resolveHold = resolve; });

    await page.route('**/api/contacts/deleted', async (route) => {
      if (route.request().method() === 'GET') {
        await hold;
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      } else {
        route.continue();
      }
    });

    await page.goto('/admin/contacts/deleted');
    await expect(page.getByTestId('deleted-contacts-loading')).toBeVisible({ timeout: 3000 });
    resolveHold();
  });

  test('deleted hackathons page shows skeleton while loading', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    let resolveHold!: () => void;
    const hold = new Promise<void>((resolve) => { resolveHold = resolve; });

    await page.route('**/api/hackathons/deleted', async (route) => {
      if (route.request().method() === 'GET') {
        await hold;
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      } else {
        route.continue();
      }
    });

    await page.goto('/admin/hackathons/deleted');
    await expect(page.getByTestId('deleted-hackathons-loading')).toBeVisible({ timeout: 3000 });
    resolveHold();
  });
});
