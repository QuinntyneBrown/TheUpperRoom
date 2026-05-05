// Traces to: Partner Edit Page — loading skeleton
// T45: edit page shows skeleton while partner data is fetching
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Partner edit page loading skeleton', () => {
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

    await page.goto('/partners/any-id/edit');
    await expect(page.getByTestId('partner-edit-loading')).toBeVisible({ timeout: 5000 });
    resolve!();
    await expect(page.getByTestId('partner-edit-loading')).not.toBeVisible({ timeout: 5000 });
  });
});
