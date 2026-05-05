// Traces to: 15 — Create Partner / list load error state
// L2-042: partner list shows error + retry when API fails
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Partner list error state', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows error when API fails to load partners', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/partners', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
      } else {
        route.continue();
      }
    });

    await page.goto('/partners');
    await expect(page.getByTestId('partners-load-error')).toBeVisible({ timeout: 3000 });
  });

  test('retry button reloads partner list', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    let failCount = 0;
    await page.route('**/api/partners', (route) => {
      if (route.request().method() === 'GET' && failCount < 1) {
        failCount++;
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
      } else {
        route.continue();
      }
    });

    await page.goto('/partners');
    await expect(page.getByTestId('partners-load-error')).toBeVisible({ timeout: 3000 });
    await page.getByTestId('partners-retry-btn').click();
    await expect(page.getByTestId('partners-load-error')).not.toBeVisible({ timeout: 3000 });
  });
});
