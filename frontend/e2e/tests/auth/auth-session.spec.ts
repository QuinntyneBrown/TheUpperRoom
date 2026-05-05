// Traces to: 79 — E2E Auth and Session Flow
// L2-063: register → verify → sign in → sign out → session expiry
// L2-064: runs on xs-mobile, md-tablet, lg-desktop
// Requires Mailpit running at localhost:8025 — set MAILPIT=true to enable
import { test, expect } from '../../fixtures';

const MAILPIT_ENABLED = process.env['MAILPIT'] === 'true';

const password = 'Str0ng!Pass#99';
const displayName = 'E2E Lead';
const teamName = 'Grace Community';

test.describe('@major-flow auth session', () => {
  test.fixme(!MAILPIT_ENABLED, 'Set MAILPIT=true and start Mailpit on localhost:8025');

  test('register, verify, sign in, sign out, session expiry', async ({ auth, mailbox }) => {
    const email = mailbox.uniqueEmail();

    await auth.register({ email, password, displayName, teamName });
    const link = await mailbox.firstVerificationLink(email);
    await auth.verifyEmail(link);
    await auth.signIn(email, password);
    await auth.assertOnDashboard();
    await auth.signOut();
    await auth.assertOnSignIn();
    await auth.expireSession();
    await auth.tryNavigateToDashboard();
    await auth.assertOnSignIn();
  });
});
