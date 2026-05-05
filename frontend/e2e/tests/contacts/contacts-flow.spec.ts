// Traces to: 80 — E2E Contact Management Flow
// L2-063: contact lifecycle and notes in one major flow
// L2-064: runs on xs-mobile at minimum
// Requires backend running with dev seed enabled (Development environment)
import { test } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('@major-flow contact lifecycle', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('contact lifecycle and notes', async ({ auth, contacts, admin }) => {
    const suffix = Date.now();
    const name = `E2E Lead ${suffix}`;
    const email = `e2e+${suffix}@flow.test`;
    const phone = '555-0100';

    await auth.signInAs('city-lead');
    await contacts.create({ name, email, phone });
    await contacts.assertOnDetail(name);
    await contacts.update({ name: 'Renamed' });
    await contacts.addNote('Met for coffee');
    await contacts.delete();
    await admin.signInAs('admin');
    await admin.deletedContacts.assertContains('Renamed');
    await admin.deletedContacts.restore('Renamed');
    await contacts.assertInList('Renamed');
  });
});
