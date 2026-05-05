// Traces to: Partners Board — loading state
// L2-021: board shows loading indicator while partners list is fetching
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Partners board loading state', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows loading indicator while board is fetching', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    let resolve: () => void;
    const hold = new Promise<void>((r) => { resolve = r; });

    await page.route('**/api/partners', async (route) => {
      if (route.request().method() === 'GET') {
        await hold;
      }
      route.continue();
    });

    const nav = page.goto('/partners/board');
    await expect(page.getByTestId('board-loading')).toBeVisible({ timeout: 3000 });
    resolve!();
    await nav;
  });

  test('hides loading indicator once board is loaded', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/partners/board');
    await expect(page.getByTestId('board-loading')).not.toBeVisible({ timeout: 5000 });
  });
});
