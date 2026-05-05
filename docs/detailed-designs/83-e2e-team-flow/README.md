# 83 — E2E Team Management Flow

**Traces to:** L2-063. L1-002, L1-004.

Vertical slice: invite member → accept invitation → assign role → revoke role → remove member → verify access changes.

## Test (`tests/team.spec.ts`)

```
test('team invite, role lifecycle, removal', async ({ auth, mailbox, team }) => {
  await auth.signInAs('city-lead');
  await team.invite('newuser@test');
  const link = await mailbox.firstInvitationLink('newuser@test');
  await auth.acceptInvitation(link, { displayName: 'New User', password: 'P@ssw0rd!' });
  await auth.signOut();
  await auth.signIn('newuser@test', 'P@ssw0rd!');
  await team.assertSelfRole('Volunteer');
  await auth.signInAs('city-lead');
  await team.assignRole('newuser@test', 'PrayerLead');
  await auth.signIn('newuser@test', 'P@ssw0rd!');
  await team.assertCanAccess('contacts:create');
  await auth.signInAs('city-lead');
  await team.revokeRole('newuser@test', 'PrayerLead');
  await team.remove('newuser@test');
  await auth.tryToSignIn('newuser@test', 'P@ssw0rd!');
  await auth.assertSignInRejected();
});
```

## Acceptance tests

- L2-063 AC: end-to-end coverage of invite, accept, assign, revoke, remove, and access-change verification.

## Radical simplicity notes

- One test exercises both sides of the invite (inviter and invitee) by switching authenticated sessions.
- Access-change verification is one positive and one negative role check, not a full permission matrix.
