// Traces to: 25 — View Local Team / 29 — View Global Teams
// L2-025: team pages show error + retry when API fails
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Team page load error states', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('local team page shows error when API fails', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/team', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
      } else {
        route.continue();
      }
    });

    await page.goto('/team');
    await expect(page.getByTestId('team-load-error')).toBeVisible({ timeout: 3000 });
  });

  test('local team page retry reloads after error', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    let failCount = 0;
    await page.route('**/api/team', (route) => {
      if (route.request().method() === 'GET' && failCount < 1) {
        failCount++;
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
      } else {
        route.continue();
      }
    });

    await page.goto('/team');
    await expect(page.getByTestId('team-load-error')).toBeVisible({ timeout: 3000 });
    await page.getByTestId('team-retry-btn').click();
    await expect(page.getByTestId('team-load-error')).not.toBeVisible({ timeout: 3000 });
  });

  test('global teams page shows error when API fails', async ({ auth, page }) => {
    await auth.signInAs('admin');

    await page.route('**/api/teams*', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
      } else {
        route.continue();
      }
    });

    await page.goto('/teams');
    await expect(page.getByTestId('teams-load-error')).toBeVisible({ timeout: 3000 });
  });
});
