// Traces to: 19 — View/Update/Delete Partner
// L2-019: partner delete error toast when API fails
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Partner delete error', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows error toast when delete fails', async ({ auth, partners, page }) => {
    await auth.signInAs('city-lead');
    await partners.create({ name: 'Delete Error Partner' });
    await partners.page.getByRole('link', { name: /Delete Error Partner/i }).click();
    await partners.page.waitForURL(/\/partners\/[a-f0-9-]+$/);

    await page.route('**/api/partners/*', (route) => {
      if (route.request().method() === 'DELETE') {
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
      } else {
        route.continue();
      }
    });

    await page.getByRole('button', { name: /delete/i }).click();
    await page.getByRole('button', { name: /delete partner/i }).click();
    await expect(page.getByTestId('partner-delete-error-toast')).toBeVisible({ timeout: 3000 });
  });
});
