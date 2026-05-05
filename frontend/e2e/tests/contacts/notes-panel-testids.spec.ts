// Traces to: T69 — notes panel add-note button needs data-testid
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Notes panel submit button testid', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('add note button has data-testid on contact detail', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const contact = {
      id: 'c-note1', firstName: 'Note', lastName: 'Btn',
      email: '', phone: '', city: '', notes: [], deletedAt: null,
    };
    await page.route('**/api/contacts/c-note1', (route) => {
      if (route.request().method() === 'GET') {
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(contact) });
      } else { route.continue(); }
    });

    await page.goto('/contacts/c-note1');
    await expect(page.getByTestId('contact-detail')).toBeVisible({ timeout: 3000 });
    await expect(page.getByTestId('add-note-btn')).toBeVisible();
  });
});
