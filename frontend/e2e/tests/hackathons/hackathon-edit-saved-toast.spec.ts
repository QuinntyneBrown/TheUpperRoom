// Traces to: T64 — hackathon-edit-page navigates with ?saved=1 so detail shows savedToast
import { test, expect } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('Hackathon edit saved toast', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('edit and save shows saved toast on detail page', async ({ auth, hackathons }) => {
    await auth.signInAs('city-lead');
    await hackathons.create({
      title: 'Edit Toast Hack',
      startDate: '2026-07-01',
      endDate: '2026-07-03',
      hostCity: 'Dublin',
    });
    await hackathons.update({ title: 'Edit Toast Hack Updated' });
    await expect(hackathons.savedToast()).toBeVisible();
  });

  test('saved toast disappears after a few seconds', async ({ auth, hackathons }) => {
    await auth.signInAs('city-lead');
    await hackathons.create({
      title: 'Edit Fade Hack',
      startDate: '2026-07-01',
      endDate: '2026-07-03',
      hostCity: 'Cork',
    });
    await hackathons.update({ title: 'Edit Fade Hack Updated' });
    await expect(hackathons.savedToast()).toBeVisible();
    await expect(hackathons.savedToast()).not.toBeVisible({ timeout: 5000 });
  });
});
