// Traces to: 08 — Create Contact
// L2-008: contact create shows error toast on non-validation API failure
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Contact create save error', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows error toast when create API fails with 500', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/contacts', (route) => {
      if (route.request().method() === 'POST') {
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
      } else {
        route.continue();
      }
    });

    await page.goto('/contacts/new');
    await page.getByLabel('First name').fill('Test');
    await page.getByLabel('Last name').fill('User');
    await page.getByRole('button', { name: /save/i }).click();
    await expect(page.getByTestId('create-save-error-toast')).toBeVisible({ timeout: 3000 });
  });
});
