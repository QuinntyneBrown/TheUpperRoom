// Traces to: 84 — E2E Dashboard Widget Flow
// L2-063: full widget lifecycle — add, remove, persist
// L2-064: lg-desktop
// Requires backend in Development mode with /api/dev/seed
import { test } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('@major-flow dashboard widget lifecycle', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('dashboard widget lifecycle and persistence', async ({ auth, dashboard }) => {
    await auth.signInAs('city-lead');
    await dashboard.goto();
    await dashboard.assertEmpty();
    await dashboard.addWidget('kpi');
    await dashboard.addWidget('line-chart');
    await dashboard.removeWidget('kpi');
    await auth.signOut();
    await auth.signInAs('city-lead');
    await dashboard.goto();
    await dashboard.assertHasWidget('line-chart');
    await dashboard.assertNoWidget('kpi');
  });
});
