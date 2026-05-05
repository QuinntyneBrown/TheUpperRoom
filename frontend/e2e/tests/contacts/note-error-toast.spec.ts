// Traces to: Contact Detail - Note Server Error Toast
// L2-022: note save failure preserves draft and shows error toast
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Note server error toast', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('failed note save shows error toast and preserves draft', async ({ auth, contacts }) => {
    await auth.signInAs('city-lead');
    await contacts.create({ name: 'Note Error Contact' });

    await contacts.page.route('**/api/contacts/*/notes', (route) => {
      route.fulfill({ status: 502, body: 'Bad Gateway' });
    });

    await contacts.page.getByLabel('New note').fill('Draft that should survive');
    await contacts.page.getByRole('button', { name: /add note/i }).click();

    await expect(contacts.page.getByTestId('note-save-error-toast')).toBeVisible();
    await expect(contacts.page.getByLabel('New note')).toHaveValue('Draft that should survive');
  });

  test('note error toast disappears after a few seconds', async ({ auth, contacts }) => {
    await auth.signInAs('city-lead');
    await contacts.create({ name: 'Note Error Fade Contact' });

    await contacts.page.route('**/api/contacts/*/notes', (route) => {
      route.fulfill({ status: 502, body: 'Bad Gateway' });
    });

    await contacts.page.getByLabel('New note').fill('Draft content');
    await contacts.page.getByRole('button', { name: /add note/i }).click();

    await expect(contacts.page.getByTestId('note-save-error-toast')).toBeVisible();
    await expect(contacts.page.getByTestId('note-save-error-toast')).not.toBeVisible({ timeout: 8000 });
  });
});
