// Traces to: T72 — conflict dialog "Keep mine" button needs data-testid
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Contact edit conflict dialog testids', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('keep mine button has data-testid', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const contact = { id: 'c-conf1', firstName: 'Conflict', lastName: 'Test', email: '', phone: '', city: '', notes: [], deletedAt: null };
    let callCount = 0;
    await page.route('**/api/contacts/c-conf1', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(contact) });
      } else if (route.request().method() === 'PUT') {
        callCount++;
        if (callCount === 1) {
          route.fulfill({ status: 409, contentType: 'application/json', body: JSON.stringify(contact) });
        } else {
          route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(contact) });
        }
      } else { route.continue(); }
    });

    await page.goto('/contacts/c-conf1/edit');
    await expect(page.getByTestId('contact-form-submit-btn')).toBeVisible({ timeout: 3000 });
    await page.getByLabel('First name').fill('Updated');
    await page.getByTestId('contact-form-submit-btn').click();
    await expect(page.getByTestId('conflict-dialog')).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('conflict-keep-mine-btn')).toBeVisible();
  });
});
