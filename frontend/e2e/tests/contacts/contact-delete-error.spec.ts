// Traces to: 11 — Delete Contact
// L2-011: contact delete error toast when API fails
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Contact delete error', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows error toast when delete fails', async ({ auth, contacts, page }) => {
    await auth.signInAs('city-lead');
    await contacts.create({ name: 'Delete Error Contact' });
    await contacts.page.getByRole('link', { name: /Delete Error Contact/i }).click();
    await contacts.page.waitForURL(/\/contacts\/[a-f0-9-]+$/);

    await page.route('**/api/contacts/*', (route) => {
      if (route.request().method() === 'DELETE') {
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
      } else {
        route.continue();
      }
    });

    await page.getByTestId('contact-delete-btn').click();
    await page.getByTestId('confirm-delete-contact-btn').click();
    await expect(page.getByTestId('contact-delete-error-toast')).toBeVisible({ timeout: 3000 });
  });
});
