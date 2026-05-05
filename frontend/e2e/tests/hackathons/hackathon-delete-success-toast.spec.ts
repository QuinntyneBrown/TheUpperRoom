// Traces to: Hackathon list page — delete success feedback
// T61: deleting a hackathon shows a success toast on the list page
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Hackathon delete success toast', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows deleted toast when navigated to list with deleted=1', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/hackathons', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: '[]' });
      } else { route.continue(); }
    });

    await page.goto('/hackathons?deleted=1');
    await expect(page.getByTestId('hackathon-deleted-toast')).toBeVisible({ timeout: 3000 });
  });
});
