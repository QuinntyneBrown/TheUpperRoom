// Traces to: Dashboard — API load error state
// L2-032: dashboard page shows error when initial layout load fails
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Dashboard load error state', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows error banner when layout GET fails', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/dashboard/layout', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 500, body: 'Internal Server Error' });
      } else {
        route.continue();
      }
    });

    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-load-error')).toBeVisible({ timeout: 3000 });
  });

  test('retry button reloads the dashboard layout', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    let failCount = 0;
    await page.route('**/api/dashboard/layout', (route) => {
      if (route.request().method() === 'GET' && failCount < 1) {
        failCount++;
        route.fulfill({ status: 500, body: 'Internal Server Error' });
      } else {
        route.continue();
      }
    });

    await page.goto('/dashboard');
    await expect(page.getByTestId('dashboard-load-error')).toBeVisible({ timeout: 3000 });
    await page.getByTestId('dashboard-load-retry-btn').click();
    await expect(page.getByTestId('dashboard-load-error')).not.toBeVisible({ timeout: 3000 });
  });
});
