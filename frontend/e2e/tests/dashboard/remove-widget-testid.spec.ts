// Traces to: T75 — dashboard remove widget button needs data-testid
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Dashboard remove widget testid', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('remove widget button has data-testid', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/dashboard/layout', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({
          status: 200, contentType: 'application/json',
          body: JSON.stringify([{ id: 'w1', type: 'line-chart', x: 0, y: 0, cols: 4, rows: 3 }]),
        });
      } else { route.continue(); }
    });

    await page.goto('/dashboard');
    await expect(page.getByTestId('remove-widget-btn').first()).toBeVisible({ timeout: 2000 });
  });
});
