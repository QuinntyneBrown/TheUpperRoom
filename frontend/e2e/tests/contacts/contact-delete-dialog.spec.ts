// Traces to: Contact detail page — delete dialog testability
// T62: delete button and dialog have data-testid for E2E targeting
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Contact delete dialog', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('delete button and confirm dialog have data-testid', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const contact = {
      id: 'c1', firstName: 'Alice', lastName: 'Smith',
      email: 'alice@example.com', phone: '', city: 'Toronto',
      notes: [], deletedAt: null,
    };
    await page.route('**/api/contacts/c1', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(contact) });
      } else { route.continue(); }
    });

    await page.goto('/contacts/c1');
    await expect(page.getByTestId('contact-detail')).toBeVisible({ timeout: 3000 });

    await page.getByTestId('contact-delete-btn').click();
    await expect(page.getByTestId('contact-delete-dialog')).toBeVisible({ timeout: 2000 });
    await expect(page.getByTestId('confirm-delete-contact-btn')).toBeVisible();
  });
});
