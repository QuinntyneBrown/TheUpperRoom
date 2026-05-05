// Traces to: 82 — E2E Hackathon Management Flow
// L2-063: full hackathon lifecycle with 4Ds stage and products
// L2-064: lg-desktop (4Ds tracker is desktop-first)
// Requires backend in Development mode with /api/dev/seed
import { test } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

const startDate = '2026-09-01';
const endDate = '2026-09-03';

test.describe('@major-flow hackathon lifecycle', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('hackathon lifecycle, 4Ds stage, products', async ({ auth, hackathons, admin }) => {
    await auth.signInAs('city-lead');
    await hackathons.create({ title: 'Toronto 2025', startDate, endDate, hostCity: 'Toronto' });
    await hackathons.assertOnDetail('Toronto 2025');
    await hackathons.update({ title: 'Toronto 2026' });
    await hackathons.changeStage('Define');
    await hackathons.changeStage('Design');
    await hackathons.addProduct({ title: 'Outreach App', description: 'PWA' });
    await hackathons.delete();
    await admin.signInAs('admin');
    await admin.deletedHackathons.restore('Toronto 2026');
  });
});
