// Traces to: Hackathon Detail Page — loading skeleton
// T45: detail page shows skeleton while hackathon data is fetching
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Hackathon detail page loading skeleton', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows loading skeleton while hackathon data is fetching', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    let resolve: () => void;
    const hold = new Promise<void>((r) => { resolve = r; });

    await page.route('**/api/hackathons/**', async (route) => {
      if (route.request().method() === 'GET') {
        await hold;
        route.continue();
      } else {
        route.continue();
      }
    });

    await page.goto('/hackathons/any-id');
    await expect(page.getByTestId('hackathon-detail-loading')).toBeVisible({ timeout: 5000 });
    resolve!();
    await expect(page.getByTestId('hackathon-detail-loading')).not.toBeVisible({ timeout: 5000 });
  });
});
