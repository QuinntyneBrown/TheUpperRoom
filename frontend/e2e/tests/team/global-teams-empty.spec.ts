// Traces to: Global Teams Page — empty state with icon
// T43: empty teams list shows icon and message
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Global teams empty state', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows icon and message when no teams exist', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/teams**', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ items: [], total: 0 }) });
      } else {
        route.continue();
      }
    });

    await page.goto('/teams');
    const empty = page.getByTestId('teams-empty');
    await expect(empty).toBeVisible({ timeout: 3000 });
    await expect(empty).toContainText('No teams found');
  });
});
