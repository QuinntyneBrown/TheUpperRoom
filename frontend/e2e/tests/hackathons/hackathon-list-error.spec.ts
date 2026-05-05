// Traces to: Hackathon List — API error state
// L2-043: list page shows error + retry when API fails
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Hackathon list error state', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows error message when API fails to load hackathons', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/hackathons', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
      } else {
        route.continue();
      }
    });

    await page.goto('/hackathons');
    await expect(page.getByTestId('hackathons-error')).toBeVisible({ timeout: 3000 });
  });

  test('retry button reloads hackathon list', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    let failCount = 0;
    await page.route('**/api/hackathons', (route) => {
      if (route.request().method() === 'GET' && failCount < 1) {
        failCount++;
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
      } else {
        route.continue();
      }
    });

    await page.goto('/hackathons');
    await expect(page.getByTestId('hackathons-error')).toBeVisible({ timeout: 3000 });
    await page.getByTestId('hackathons-retry-btn').click();
    await expect(page.getByTestId('hackathons-error')).not.toBeVisible({ timeout: 3000 });
  });
});
