// Traces to: Hackathon Edit Page — loading state
// L2-063: edit page shows loading state while hackathon data is fetching
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Hackathon edit page loading state', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows loading state while hackathon data is fetching', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    let resolve: () => void;
    const hold = new Promise<void>((r) => { resolve = r; });

    await page.route('**/api/hackathons/**', async (route) => {
      if (route.request().method() === 'GET') {
        await hold;
      }
      route.continue();
    });

    const nav = page.goto('/hackathons/any-id/edit');
    await expect(page.getByTestId('hackathon-edit-loading')).toBeVisible({ timeout: 3000 });
    resolve!();
    await nav;
  });

  test('shows not-found state when hackathon does not exist', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/hackathons/**', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 404, body: 'Not Found' });
      } else {
        route.continue();
      }
    });

    await page.goto('/hackathons/nonexistent-id/edit');
    await expect(page.getByTestId('hackathon-edit-not-found')).toBeVisible({ timeout: 3000 });
  });
});
