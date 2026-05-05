// Traces to: 19 — View/Update/Delete Partner
// L2-019: partner edit shows error toast on non-409 API failure
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Partner edit generic save error', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows error toast when save fails with 500', async ({ auth, partners, page }) => {
    await auth.signInAs('city-lead');
    await partners.create({ name: 'Edit Error Partner' });
    await partners.page.getByRole('link', { name: /edit/i }).click();
    await partners.page.waitForURL(/\/partners\/[a-f0-9-]+\/edit/);

    await page.route('**/api/partners/*', (route) => {
      if (route.request().method() === 'PUT') {
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
      } else {
        route.continue();
      }
    });

    await partners.page.getByLabel(/organization name/i).fill('Error Test');
    await partners.page.getByTestId('partner-edit-save-btn').click();
    await expect(page.getByTestId('edit-save-error-toast')).toBeVisible({ timeout: 3000 });
  });
});
