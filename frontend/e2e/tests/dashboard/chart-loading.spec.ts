// Traces to: Line Chart Widget — loading state
// L2-034: chart widget shows loading spinner while metric data is fetching
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Line chart widget loading state', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows loading spinner while chart data is fetching', async ({ auth, dashboard, page }) => {
    await auth.signInAs('city-lead');

    let resolve: () => void;
    const hold = new Promise<void>((r) => { resolve = r; });

    await page.route('**/api/metrics/**', async (route) => {
      await hold;
      route.continue();
    });

    await dashboard.goto();
    await dashboard.addFirstWidget();
    await expect(page.getByTestId('chart-loading')).toBeVisible({ timeout: 5000 });
    resolve!();
    await expect(page.getByTestId('chart-loading')).not.toBeVisible({ timeout: 5000 });
  });
});
