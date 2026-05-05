// T86: partner board load error has a data-testid retry button
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Partner board retry button testid', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('board load error shows retry button with data-testid', async ({ auth, page }) => {
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
    await expect(page.getByTestId('board-load-retry-btn')).toBeVisible();
  });
});
