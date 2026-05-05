// Traces to: 45 — Delete and Restore Hackathon
// L2-045: hackathon delete error toast when API fails
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Hackathon delete error', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows error toast when delete fails', async ({ auth, hackathons, page }) => {
    await auth.signInAs('city-lead');
    await hackathons.create({ title: 'Delete Error Test', startDate: '2026-09-01', endDate: '2026-09-03', hostCity: 'Toronto' });
    await hackathons.assertOnDetail('Delete Error Test');

    await page.route('**/api/hackathons/*', (route) => {
      if (route.request().method() === 'DELETE') {
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
      } else {
        route.continue();
      }
    });

    await page.getByTestId('hackathon-more-btn').click();
    await page.getByTestId('hackathon-delete-menu-item').click();
    await page.getByTestId('confirm-delete-hackathon-btn').click();
    await expect(page.getByTestId('hackathon-delete-error-toast')).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('hackathon-delete-dialog')).not.toBeVisible({ timeout: 1000 });
  });
});
