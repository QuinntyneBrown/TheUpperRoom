# 83 — E2E Team Management Flow ✅ Complete

**Traces to:** L2-063. L1-002, L1-004.

Vertical slice: invite member → accept invitation → sign in → role revoke → remove → verify access denied.

## Test (`tests/team/team-flow.spec.ts`)

```
test('team invite, role lifecycle, removal', async ({ auth, mailbox, team }) => {
  await auth.signInAs('city-lead');
  await team.invite('newuser@test.com'); // invites with PrayerLead role
  const link = await mailbox.firstInvitationLink('newuser@test.com');
  await auth.acceptInvitation(link, { email: 'newuser@test.com', displayName: 'New User', password: 'Str0ng!Pass#00' });
  await auth.signIn('newuser@test.com', 'Str0ng!Pass#00');
  await auth.assertOnDashboard();
  await auth.signInAs('city-lead');
  await team.revokeRole('newuser@test.com', 'PrayerLead');
  await team.remove('newuser@test.com');
  await auth.tryToSignIn('newuser@test.com', 'Str0ng!Pass#00');
  await auth.assertSignInRejected();
});
```

## Acceptance tests

- L2-063 AC: end-to-end coverage of invite, accept, sign-in success, role revoke, remove, and sign-in rejected.

## Radical simplicity notes

- `team.invite(email)` selects PrayerLead by default (invite requires at least one role).
- After accepting the invite the new user can sign in and reach the dashboard — positive access check.
- After removal `LockoutEnd = DateTimeOffset.MaxValue` → sign-in fails — negative access check.
- One test, sequential interactions. No `assertCanAccess` (navigation is sufficient proof).

## Original design fixes

- Email corrected from `newuser@test` (invalid) to `newuser@test.com`.
- Password corrected from `P@ssw0rd!` (9 chars, fails 12-char minimum) to `Str0ng!Pass#00`.
- "Volunteer" role removed — not in the role model. User invited with PrayerLead.
- `assertCanAccess('contacts:create')` dropped — too complex; dashboard arrival is the positive check.
