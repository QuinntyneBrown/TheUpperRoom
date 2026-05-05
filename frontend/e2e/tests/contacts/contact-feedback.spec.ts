// Traces to: Contact Edit - Saved Toast, Contact List - Deleted Toast
// L2-011: edit save feedback; L2-012: delete feedback on list
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Contact feedback toasts', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('edit and save shows saved toast on detail page', async ({ auth, contacts }) => {
    await auth.signInAs('city-lead');
    await contacts.create({ name: 'Toast Save Contact' });
    await contacts.update({ name: 'Toast Save Updated' });
    await expect(contacts.savedToast()).toBeVisible();
  });

  test('saved toast disappears after a few seconds', async ({ auth, contacts }) => {
    await auth.signInAs('city-lead');
    await contacts.create({ name: 'Toast Fade Contact' });
    await contacts.update({ name: 'Toast Fade Updated' });
    await expect(contacts.savedToast()).toBeVisible();
    await expect(contacts.savedToast()).not.toBeVisible({ timeout: 5000 });
  });

  test('delete contact shows deleted toast on contacts list', async ({ auth, contacts }) => {
    await auth.signInAs('city-lead');
    await contacts.create({ name: 'Toast Delete Contact' });
    await contacts.delete();
    await expect(contacts.deletedToast()).toBeVisible();
  });

  test('deleted toast disappears after a few seconds', async ({ auth, contacts }) => {
    await auth.signInAs('city-lead');
    await contacts.create({ name: 'Toast Delete Fade' });
    await contacts.delete();
    await expect(contacts.deletedToast()).toBeVisible();
    await expect(contacts.deletedToast()).not.toBeVisible({ timeout: 5000 });
  });
});
