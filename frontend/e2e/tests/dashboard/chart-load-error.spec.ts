// Traces to: Line Chart Widget — metric load error
// L2-034: chart widget shows error state when metric API fails
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Line chart widget load error', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows error state inside widget when metrics fail to load', async ({ auth, dashboard, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/metrics/**', (route) => {
      route.fulfill({ status: 500, body: 'Internal Server Error' });
    });

    await dashboard.goto();
    await dashboard.addFirstWidget();
    await expect(page.getByTestId('chart-load-error')).toBeVisible({ timeout: 5000 });
  });
});
