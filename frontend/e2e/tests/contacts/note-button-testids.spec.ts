// Traces to: T77 — notes panel edit/save/delete action buttons need data-testid
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Notes panel button testids', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('note edit and delete buttons have data-testid', async ({ auth, page }) => {
    await auth.signInAs('city-lead');

    const note = { id: 'n1', body: 'Test note', createdAt: new Date().toISOString(), authorId: 'u1' };
    const contact = { id: 'c-t77', firstName: 'T77', lastName: 'Test', email: '', phone: '', city: '', notes: [note], deletedAt: null };

    await page.route('**/api/contacts/c-t77', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(contact) });
    });
    await page.route('**/api/contacts/c-t77/notes', (route) => {
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([note]) });
    });
    await page.route('**/api/auth/me', (route) => {
      route.fulfill({
        status: 200, contentType: 'application/json',
        body: JSON.stringify({ id: 'u1', email: 'lead@test.com', displayName: 'City Lead', roles: ['CityLead'] }),
      });
    });

    await page.goto('/contacts/c-t77');
    await expect(page.getByTestId('note-edit-btn').first()).toBeVisible({ timeout: 2000 });
    await expect(page.getByTestId('note-delete-btn').first()).toBeVisible({ timeout: 2000 });
  });
});
