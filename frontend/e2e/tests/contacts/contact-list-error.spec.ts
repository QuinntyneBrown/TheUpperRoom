// Traces to: 14 — List Contacts / load error state
// L2-042: contact list shows error + retry when API fails
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Contact list error state', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows error when API fails to load contacts', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/contacts*', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
      } else {
        route.continue();
      }
    });

    await page.goto('/contacts');
    await expect(page.getByTestId('contacts-load-error')).toBeVisible({ timeout: 3000 });
  });

  test('retry button reloads contact list', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    let failCount = 0;
    await page.route('**/api/contacts*', (route) => {
      if (route.request().method() === 'GET' && failCount < 1) {
        failCount++;
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
      } else {
        route.continue();
      }
    });

    await page.goto('/contacts');
    await expect(page.getByTestId('contacts-load-error')).toBeVisible({ timeout: 3000 });
    await page.getByTestId('contacts-retry-btn').click();
    await expect(page.getByTestId('contacts-load-error')).not.toBeVisible({ timeout: 3000 });
  });
});
