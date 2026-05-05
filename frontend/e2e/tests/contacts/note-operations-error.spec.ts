// Traces to: 12 — Contact Notes
// L2-012: notes panel shows error on update and delete failures
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Notes panel operation errors', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('shows error toast when note update fails', async ({ auth, contacts, page }) => {
    await auth.signInAs('city-lead');
    await contacts.create({ name: 'Note Error Contact' });
    await contacts.page.getByRole('link', { name: /Note Error Contact/i }).click();
    await contacts.page.waitForURL(/\/contacts\/[a-f0-9-]+$/);

    await page.getByPlaceholder(/add a note/i).fill('Test note');
    await page.getByRole('button', { name: /add note/i }).click();
    await page.waitForFunction(() => document.querySelectorAll('[data-testid^="note-"]').length > 0, { timeout: 3000 }).catch(() => {});

    await page.route('**/api/notes/*', (route) => {
      if (route.request().method() === 'PUT') {
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
      } else {
        route.continue();
      }
    });

    const editBtn = page.getByRole('button', { name: /edit/i }).first();
    await editBtn.click();
    await page.getByRole('textbox').last().fill('Updated note');
    await page.getByRole('button', { name: /save/i }).last().click();
    await expect(page.getByTestId('note-operation-error-toast')).toBeVisible({ timeout: 3000 });
  });

  test('shows error toast when note delete fails', async ({ auth, contacts, page }) => {
    await auth.signInAs('city-lead');
    await contacts.create({ name: 'Note Delete Error Contact' });
    await contacts.page.getByRole('link', { name: /Note Delete Error Contact/i }).click();
    await contacts.page.waitForURL(/\/contacts\/[a-f0-9-]+$/);

    await page.getByPlaceholder(/add a note/i).fill('Delete test note');
    await page.getByRole('button', { name: /add note/i }).click();
    await page.waitForFunction(() => document.querySelectorAll('[data-testid^="note-"]').length > 0, { timeout: 3000 }).catch(() => {});

    await page.route('**/api/notes/*', (route) => {
      if (route.request().method() === 'DELETE') {
        route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'server error' }) });
      } else {
        route.continue();
      }
    });

    const deleteBtn = page.getByRole('button', { name: /delete/i }).first();
    await deleteBtn.click();
    await page.getByRole('button', { name: /confirm/i }).click();
    await expect(page.getByTestId('note-operation-error-toast')).toBeVisible({ timeout: 3000 });
  });
});
