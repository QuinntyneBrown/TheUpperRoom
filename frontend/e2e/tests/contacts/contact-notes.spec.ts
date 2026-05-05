// Traces to: 12 — Contact Notes
// L2-013 AC: inline add-note form, edit-in-place, delete confirm
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Contact Notes', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('notes panel is present on contact detail page', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const contact = { id: 'c-notes1', firstName: 'Notes', lastName: 'Test', email: '', phone: '', city: '', notes: [], deletedAt: null };
    await page.route('**/api/contacts/c-notes1', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(contact) });
    });

    await page.goto('/contacts/c-notes1');
    await expect(page.getByTestId('contact-notes-section')).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('add-note-form')).toBeVisible();
  });

  test.fixme('author can add a note and it appears in the list', async ({ page, contacts }) => {
    // Requires authenticated session with seeded contact
  });

  test.fixme('author can edit own note inline', async ({ page, contacts }) => {
    // Requires authenticated session with seeded contact + existing note
  });

  test.fixme('author can delete own note with confirm', async ({ page, contacts }) => {
    // Requires authenticated session with seeded contact + existing note
  });

  test.fixme('body exceeding 4000 chars shows validation error', async ({ page, contacts }) => {
    // Requires authenticated session
  });
});
