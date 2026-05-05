// Traces to: 81 — E2E Partner Management Flow
// L2-063: partner lifecycle, notes, contact association, stage change
// L2-064: xs-mobile and lg-desktop
// Requires backend in Development mode with /api/dev/seed
import { test } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('@major-flow partner lifecycle', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('partner lifecycle, association, stage change', async ({ auth, partners }) => {
    await auth.signInAs('city-lead');
    await partners.create({ name: 'Hope Church', city: 'Toronto' });
    await partners.associateContact('Pastor Joy');
    await partners.addNote('Initial outreach');
    await partners.changeStage();
    await partners.assertListChip('In Funnel').showsPartner('Hope Church');
    await partners.openBoard();
    await partners.assertBoard('InFunnel').contains('Hope Church');
    await partners.update({ name: 'Hope Community Church' });
    await partners.delete('Hope Community Church');
  });
});
