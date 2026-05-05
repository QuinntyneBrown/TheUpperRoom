// Traces to: 44 — Update Hackathon
// L2-044: hackathon edit shows error toast on non-validation API failure
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Hackathon edit generic save error', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows error toast when save fails with 500', async ({ auth, hackathons, page }) => {
    await auth.signInAs('city-lead');
    await hackathons.create({ title: 'Edit Error Hackathon', startDate: '2026-09-01', endDate: '2026-09-03', hostCity: 'Toronto' });
    await hackathons.assertOnDetail('Edit Error Hackathon');
    await page.getByRole('link', { name: /edit/i }).click();
    await page.waitForURL(/\/hackathons\/[a-f0-9-]+\/edit/);

    await page.route('**/api/hackathons/*', (route) => {
      if (route.request().method() === 'PUT') {
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
      } else {
        route.continue();
      }
    });

    await page.getByLabel(/title/i).fill('Updated Title');
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByTestId('edit-save-error-toast')).toBeVisible({ timeout: 3000 });
  });
});
