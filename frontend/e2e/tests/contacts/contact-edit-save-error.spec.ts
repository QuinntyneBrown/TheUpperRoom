// Traces to: 10 — Update Contact
// L2-010: contact edit shows error toast on non-validation, non-409 API failure
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Contact edit generic save error', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows error toast when save fails with 500', async ({ auth, contacts, page }) => {
    await auth.signInAs('city-lead');
    await contacts.create({ name: 'Edit Error Contact' });
    await contacts.page.getByTestId('contact-edit-link').click();
    await contacts.page.waitForURL(/\/contacts\/[a-f0-9-]+\/edit/);

    await page.route('**/api/contacts/*', (route) => {
      if (route.request().method() === 'PUT') {
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
      } else {
        route.continue();
      }
    });

    await contacts.page.getByLabel('First name').fill('Error Test');
    await contacts.page.getByTestId('contact-form-submit-btn').click();
    await expect(page.getByTestId('edit-save-error-toast')).toBeVisible({ timeout: 3000 });
  });
});
