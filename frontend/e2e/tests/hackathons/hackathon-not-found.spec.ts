// Traces to: Hackathon detail page — not found state
// T53: navigating to a non-existent hackathon shows a not-found message
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Hackathon not found', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows not-found state for unknown hackathon id', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/hackathons/nonexistent-id', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 404, contentType: 'application/json', body: '{}' });
      } else {
        route.continue();
      }
    });

    await page.goto('/hackathons/nonexistent-id');
    await expect(page.getByTestId('hackathon-not-found')).toBeVisible({ timeout: 3000 });
  });
});
