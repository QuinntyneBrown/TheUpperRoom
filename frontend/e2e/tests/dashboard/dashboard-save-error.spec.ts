// Traces to: Dashboard - Save Failed Toast
// L2-025: dashboard layout save failure feedback
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Dashboard save failed toast', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('save failure shows error toast', async ({ auth, dashboard }) => {
    await auth.signInAs('city-lead');
    await dashboard.goto();

    await dashboard.page.route('**/api/dashboard/layout', (route) => {
      if (route.request().method() === 'PUT' || route.request().method() === 'POST') {
        route.fulfill({ status: 502, body: 'Bad Gateway' });
      } else {
        route.continue();
      }
    });

    await dashboard.addFirstWidget();
    await expect(dashboard.saveErrorToast()).toBeVisible({ timeout: 3000 });
  });

  test('save error toast has retry button', async ({ auth, dashboard }) => {
    await auth.signInAs('city-lead');
    await dashboard.goto();

    await dashboard.page.route('**/api/dashboard/layout', (route) => {
      if (route.request().method() === 'PUT' || route.request().method() === 'POST') {
        route.fulfill({ status: 502, body: 'Bad Gateway' });
      } else {
        route.continue();
      }
    });

    await dashboard.addFirstWidget();
    await expect(dashboard.saveErrorToast().getByTestId('layout-save-retry-btn')).toBeVisible({ timeout: 3000 });
  });
});
