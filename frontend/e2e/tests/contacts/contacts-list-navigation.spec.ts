// Traces to: T82 — contacts list page header link and pagination buttons need data-testid
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Contacts list navigation testids', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('New contact header link has data-testid', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/contacts', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ rows: [], total: 0 }) });
      } else { route.continue(); }
    });

    await page.goto('/contacts');
    await expect(page.getByTestId('new-contact-btn')).toBeVisible({ timeout: 2000 });
  });

  test('pagination buttons have data-testid when multiple pages exist', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const rows = Array.from({ length: 26 }, (_, i) => ({
      id: `c-${i}`, firstName: `Contact`, lastName: `${i}`, email: '', city: '',
    }));

    await page.route('**/api/contacts*', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ rows: rows.slice(0, 25), total: 26 }) });
      } else { route.continue(); }
    });

    await page.goto('/contacts');
    await expect(page.getByTestId('contacts-next-page')).toBeVisible({ timeout: 2000 });
  });
});
