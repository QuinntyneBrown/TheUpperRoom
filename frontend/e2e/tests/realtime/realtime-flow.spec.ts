// Traces to: 85 — E2E Realtime Notification Flow
// L2-063: contactCreated → SignalR broadcast → notification center updates
// Requires backend in Development mode with /api/dev/seed
import { test } from '../../fixtures';

const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('@major-flow realtime notification', () => {
  test.fixme(!DEV_ENABLED, 'Requires backend in Development mode with /api/dev/seed');

  test('realtime contactCreated delivered to notification center', async ({ auth, contacts, notifications }) => {
    await auth.signInAs('city-lead');
    await notifications.open();
    await contacts.create({ firstName: 'Realtime', lastName: 'Person', city: 'Test City' });
    await notifications.assertContains('contactCreated');
  });
});
