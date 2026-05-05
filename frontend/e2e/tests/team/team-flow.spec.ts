// Traces to: 83 — E2E Team Management Flow
// L2-063: invite, accept, sign-in success, role revoke, remove, sign-in rejected
// Requires backend in Development mode with /api/dev/seed and Mailpit
import { test } from '../../fixtures';

const MAILPIT_ENABLED = process.env['MAILPIT'] === 'true';
const DEV_ENABLED = process.env['CI'] !== 'true' || process.env['DEV_E2E'] === 'true';

test.describe('@major-flow team lifecycle', () => {
  test.fixme(!MAILPIT_ENABLED || !DEV_ENABLED, 'Requires MAILPIT=true and backend in Development mode');

  test('team invite, role lifecycle, removal', async ({ auth, mailbox, team }) => {
    await auth.signInAs('city-lead');
    await team.invite('newuser@test.com');
    const link = await mailbox.firstInvitationLink('newuser@test.com');
    await auth.acceptInvitation(link, { displayName: 'New User', password: 'Str0ng!Pass#00' });
    await auth.signIn('newuser@test.com', 'Str0ng!Pass#00');
    await auth.assertOnDashboard();
    await auth.signInAs('city-lead');
    await team.revokeRole('newuser@test.com', 'PrayerLead');
    await team.remove('newuser@test.com');
    await auth.tryToSignIn('newuser@test.com', 'Str0ng!Pass#00');
    await auth.assertSignInRejected();
  });
});
