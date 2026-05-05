// Traces to: Admin deleted pages — table accessible labels
// T58: deleted contacts and hackathons tables have aria-label
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Admin tables aria-label', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('deleted contacts table has aria-label', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const rows = [{ id: '1', name: 'Alice Smith', deletedAt: '2026-01-01T00:00:00Z' }];
    await page.route('**/api/contacts/deleted', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(rows) });
      } else { route.continue(); }
    });

    await page.goto('/admin/contacts/deleted');
    const table = page.locator('table[aria-label="Deleted contacts"]');
    await expect(table).toBeAttached({ timeout: 3000 });
  });

  test('deleted hackathons table has aria-label', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const rows = [{ id: '1', title: 'Spring Hack', deletedAt: '2026-01-01T00:00:00Z' }];
    await page.route('**/api/hackathons/deleted', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(rows) });
      } else { route.continue(); }
    });

    await page.goto('/admin/hackathons/deleted');
    const table = page.locator('table[aria-label="Deleted hackathons"]');
    await expect(table).toBeAttached({ timeout: 3000 });
  });
});
