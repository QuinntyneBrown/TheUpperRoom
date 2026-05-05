// Traces to: Partner detail page — not found state
// T53: navigating to a non-existent partner shows a not-found message
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Partner not found', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows not-found state for unknown partner id', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/partners/nonexistent-id', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 404, contentType: 'application/json', body: '{}' });
      } else {
        route.continue();
      }
    });

    await page.goto('/partners/nonexistent-id');
    await expect(page.getByTestId('partner-not-found')).toBeVisible({ timeout: 3000 });
  });
});
