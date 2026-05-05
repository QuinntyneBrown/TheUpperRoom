// Traces to: Partner Detail Page — loading skeleton
// T44: detail page shows skeleton while partner data is fetching
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Partner detail page loading skeleton', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows loading skeleton while partner data is fetching', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    let resolve: () => void;
    const hold = new Promise<void>((r) => { resolve = r; });

    await page.route('**/api/partners/**', async (route) => {
      if (route.request().method() === 'GET') {
        await hold;
        route.continue();
      } else {
        route.continue();
      }
    });

    await page.goto('/partners/any-id');
    await expect(page.getByTestId('partner-detail-loading')).toBeVisible({ timeout: 5000 });
    resolve!();
    await expect(page.getByTestId('partner-detail-loading')).not.toBeVisible({ timeout: 5000 });
  });
});
