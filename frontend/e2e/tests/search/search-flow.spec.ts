// Traces to: 86 — E2E Global Search Flow
// L2-063: search grouped results, selection, navigation
// L2-064: lg-desktop
// Requires backend in Development mode with /api/dev/seed
import { test } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('@major-flow global search', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('global search across entity groups', async ({ auth, contacts, partners, hackathons, search }) => {
    await auth.signInAs('city-lead');
    await contacts.create({ name: 'Searchable Contact' });
    await partners.create({ name: 'Searchable Partner' });
    await hackathons.create({ title: 'Searchable Hackathon', startDate: '2026-09-01', endDate: '2026-09-03', hostCity: 'Toronto' });
    await search.open();
    await search.query('Searchable');
    await search.assertGroups(['Contacts', 'Partners', 'Hackathons']);
    await search.selectResult('Searchable Partner');
    await search.assertNavigatedTo(/\/partners\/[a-f0-9-]+$/);
  });
});
