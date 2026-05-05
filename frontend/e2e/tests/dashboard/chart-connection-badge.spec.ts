// Traces to: Chart Card - Live/Stale/Offline Status Badges
// L2-030: chart card shows SignalR connection state badge
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Chart card connection status badge', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('chart widget shows a connection status badge', async ({ auth, dashboard, page }) => {
    await auth.signInAs('city-lead');
    await dashboard.goto();
    await dashboard.addFirstWidget();
    await expect(page.getByTestId('chart-connection-badge')).toBeVisible({ timeout: 5000 });
  });

  test('connection badge shows offline state when SignalR is disconnected', async ({ auth, dashboard, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/realtime/negotiate*', (route) => {
      route.fulfill({ status: 503, body: 'Service Unavailable' });
    });

    await dashboard.goto();
    await dashboard.addFirstWidget();
    await expect(page.getByTestId('chart-connection-badge')).toHaveAttribute('data-state', 'disconnected', { timeout: 5000 });
  });
});
