// Traces to: Contact edit page — not found state
// T54: navigating to edit a non-existent contact shows a not-found message
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Contact edit not found', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows not-found state for unknown contact id', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    await page.route('**/api/contacts/nonexistent-id', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 404, contentType: 'application/json', body: '{}' });
      } else {
        route.continue();
      }
    });

    await page.goto('/contacts/nonexistent-id/edit');
    await expect(page.getByTestId('contact-edit-not-found')).toBeVisible({ timeout: 3000 });
  });
});
