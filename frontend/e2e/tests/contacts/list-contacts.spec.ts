// Traces to: 14 — List & Paginate Contacts
// L2-015: contacts list shows 25/page, sortable columns, mobile card view
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('List Contacts', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('contacts table renders when contacts exist', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/contacts*', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200, contentType: 'application/json',
          body: JSON.stringify({ rows: [{ id: 'c1', firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', city: 'Toronto' }], total: 1 }),
        });
      } else { route.continue(); }
    });

    await page.goto('/contacts');
    await expect(page.getByTestId('contacts-table')).toBeVisible({ timeout: 3000 });
  });

  test('shows new contact button', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/contacts*', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ rows: [], total: 0 }) });
      } else { route.continue(); }
    });

    await page.goto('/contacts');
    await expect(page.getByTestId('new-contact-btn')).toBeVisible({ timeout: 2000 });
  });

  test.fixme('clicking sort header toggles asc/desc', async ({ page, contacts }) => {
    // Requires authenticated session with seeded contacts
  });

  test.fixme('mobile view renders card list under 576px', async ({ page, contacts }) => {
    // Requires viewport resize and authenticated session
  });
});
