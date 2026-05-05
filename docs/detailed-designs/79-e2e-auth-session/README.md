# 79 — E2E Auth and Session Flow

**Traces to:** L2-063, L2-064. L1-001, L1-002.

Vertical slice: register → verify email → sign in → sign out → expired-session rejection. Runs on the required viewport projects.

## Test (`tests/auth.spec.ts`)

```
test('register, verify, sign in, sign out, session expiry', async ({ auth, mailbox }) => {
  const email = mailbox.uniqueEmail();
  await auth.register({ email, password, displayName, teamName });
  const link = await mailbox.firstVerificationLink(email);
  await auth.verifyEmail(link);
  await auth.signIn(email, password);
  await auth.assertOnDashboard();
  await auth.signOut();
  await auth.assertOnSignIn();
  await auth.expireSession(); // forces token clock-skew helper
  await auth.tryNavigateToDashboard();
  await auth.assertOnSignIn();
});
```

## Acceptance tests

- L2-063 AC: this flow exists, passes, and is tagged as a major flow.
- L2-064 AC: runs on `xs-mobile`, `md-tablet`, `lg-desktop` projects.

## Radical simplicity notes

- One test, one page-object surface (`AuthPages`), no global before-hooks reaching into auth state.
- Session expiry is forced via a test-only token helper — no waiting on real clocks.
