// Traces to: 11 — Delete Contact
// L2-012 AC: confirm dialog, soft delete, contact disappears; restore by admin
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Delete Contact', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('contact detail page shows delete button for city-lead', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const contact = { id: 'c-del1', firstName: 'Bob', lastName: 'Jones', email: '', phone: '', city: '', notes: [], deletedAt: null };
    await page.route('**/api/contacts/c-del1', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(contact) });
    });

    await page.goto('/contacts/c-del1');
    await expect(page.getByTestId('contact-delete-btn')).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('contact-delete-btn')).toBeEnabled();
  });

  test.fixme('city lead can delete contact via confirm dialog', async ({ page, contacts }) => {
    // Requires authenticated session with seeded contact
  });

  test.fixme('deleted contact does not appear in list', async ({ page, contacts }) => {
    // Requires full e2e session
  });
});
