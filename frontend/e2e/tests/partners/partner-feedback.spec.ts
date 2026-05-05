// Traces to: partner-detail design — Stage Success Toast, Linked Toast, Saved Toast
// L2-017: stage change feedback; L2-018: contact linked feedback; L2-019/L2-020: edit save feedback
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Partner detail feedback toasts', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('stage change shows success toast', async ({ auth, partners }) => {
    await auth.signInAs('city-lead');
    await partners.create({ name: 'Toast Stage Partner', city: 'Dublin' });
    await partners.page.getByTestId('stage-advance-btn').click();
    await expect(partners.stageSuccessToast()).toBeVisible();
  });

  test('success toast disappears after a few seconds', async ({ auth, partners }) => {
    await auth.signInAs('city-lead');
    await partners.create({ name: 'Toast Fade Partner', city: 'Cork' });
    await partners.page.getByTestId('stage-advance-btn').click();
    await expect(partners.stageSuccessToast()).toBeVisible();
    await expect(partners.stageSuccessToast()).not.toBeVisible({ timeout: 5000 });
  });

  test('create and link contact shows linked toast with Open link', async ({ auth, partners }) => {
    await auth.signInAs('city-lead');
    await partners.create({ name: 'Toast Link Partner', city: 'Galway' });
    await partners.page.getByTestId('add-contact-btn').click();
    await partners.page.getByTestId('new-contact-first-name').fill('Toast');
    await partners.page.getByTestId('new-contact-last-name').fill('Contact');
    await partners.page.getByTestId('create-link-btn').click();
    await expect(partners.linkedToast()).toBeVisible();
    await expect(partners.linkedToast().getByRole('link', { name: /open/i })).toBeVisible();
  });

  test('edit partner save shows saved toast on detail page', async ({ auth, partners }) => {
    await auth.signInAs('city-lead');
    await partners.create({ name: 'Toast Save Partner', city: 'Limerick' });
    await partners.update({ name: 'Toast Save Updated' });
    await expect(partners.savedToast()).toBeVisible();
  });
});
