// Traces to: Global Teams Page — loading state
// L2-030: teams page shows skeleton while API loads
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Global teams page loading state', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows loading skeleton while teams list is fetching', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    let resolve: () => void;
    const hold = new Promise<void>((r) => { resolve = r; });

    await page.route('**/api/teams/global**', async (route) => {
      await hold;
      route.continue();
    });

    const nav = page.goto('/teams/global');
    await expect(page.getByTestId('teams-loading')).toBeVisible({ timeout: 3000 });
    resolve!();
    await nav;
  });

  test('hides loading skeleton once teams are loaded', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/teams/global');
    await expect(page.getByTestId('teams-loading')).not.toBeVisible({ timeout: 5000 });
  });
});
