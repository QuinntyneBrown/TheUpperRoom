// Traces to: 20 — Partner Board
// L2-020: partner board shows error when API fails to load
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Partners board error state', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows error when API fails to load partners for board', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/partners', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
      } else {
        route.continue();
      }
    });

    await page.goto('/partners/board');
    await expect(page.getByTestId('board-load-error')).toBeVisible({ timeout: 3000 });
  });
});
