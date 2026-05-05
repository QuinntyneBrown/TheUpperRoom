// Traces to: Partner List Page — loading skeleton
// T46: list page shows skeleton while partners are loading
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Partner list page loading skeleton', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows loading skeleton while partners are fetching', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    let resolve: () => void;
    const hold = new Promise<void>((r) => { resolve = r; });

    await page.route('**/api/partners', async (route) => {
      if (route.request().method() === 'GET') {
        await hold;
        route.continue();
      } else {
        route.continue();
      }
    });

    await page.goto('/partners');
    await expect(page.getByTestId('partners-list-loading')).toBeVisible({ timeout: 5000 });
    resolve!();
    await expect(page.getByTestId('partners-list-loading')).not.toBeVisible({ timeout: 5000 });
  });
});
