// Traces to: Partner List - Deleted Toast
// L2-021: partner delete feedback on list
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Partner deleted toast', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('delete partner shows deleted toast on partners list', async ({ auth, partners }) => {
    await auth.signInAs('city-lead');
    await partners.create({ name: 'Toast Delete Partner', city: 'Dublin' });
    await partners.delete('Toast Delete Partner');
    await expect(partners.deletedToast()).toBeVisible();
  });

  test('deleted toast disappears after a few seconds', async ({ auth, partners }) => {
    await auth.signInAs('city-lead');
    await partners.create({ name: 'Toast Delete Fade Partner', city: 'Cork' });
    await partners.delete('Toast Delete Fade Partner');
    await expect(partners.deletedToast()).toBeVisible();
    await expect(partners.deletedToast()).not.toBeVisible({ timeout: 5000 });
  });
});
