// Traces to: Local Team Page — loading state
// L2-026: team page shows skeleton while members are fetching
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Local team page loading state', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows loading skeleton while team members are fetching', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    let resolve: () => void;
    const hold = new Promise<void>((r) => { resolve = r; });

    await page.route('**/api/teams/local**', async (route) => {
      await hold;
      route.continue();
    });

    const nav = page.goto('/team');
    await expect(page.getByTestId('team-loading')).toBeVisible({ timeout: 3000 });
    resolve!();
    await nav;
  });

  test('hides loading skeleton once team members are loaded', async ({ auth, page }) => {
    await auth.signInAs('city-lead');
    await page.goto('/team');
    await expect(page.getByTestId('team-loading')).not.toBeVisible({ timeout: 5000 });
  });
});
