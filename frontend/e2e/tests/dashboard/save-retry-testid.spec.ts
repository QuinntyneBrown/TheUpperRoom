// Traces to: T78 — dashboard save error toast retry button needs data-testid
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Dashboard save retry testid', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('save error toast retry button has data-testid', async ({ auth, dashboard }) => {
    await auth.signInAs('city-lead');
    await dashboard.goto();

    await dashboard.page.route('**/api/dashboard/layout', (route) => {
      if (route.request().method() === 'PUT' || route.request().method() === 'POST') {
        route.fulfill({ status: 502, body: 'Bad Gateway' });
      } else { route.continue(); }
    });

    await dashboard.addFirstWidget();
    await expect(dashboard.saveErrorToast().getByTestId('layout-save-retry-btn')).toBeVisible({ timeout: 3000 });
  });
});
