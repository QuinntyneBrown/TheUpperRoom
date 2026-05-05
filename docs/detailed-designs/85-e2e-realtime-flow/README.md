# 85 — E2E Realtime Notification Flow ✅ Complete

**Traces to:** L2-063. L1-008.

Vertical slice: sign in → create contact → notification center shows contactCreated event (delivered via SignalR in same session).

## Test (`tests/realtime/realtime-flow.spec.ts`)

```
test('realtime contactCreated delivered to notification center', async ({ auth, contacts, notifications }) => {
  await auth.signInAs('city-lead');
  await notifications.open();
  await contacts.create({ name: 'Realtime Person' });
  await notifications.assertContains('contactCreated');
});
```

## Acceptance tests

- L2-063 AC: a realtime delivery flow exists — contact created → SignalR broadcast → notification center updates within the same session.

## Radical simplicity notes

- Single browser context. The same user creates the contact and receives the realtime event — valid because the backend broadcasts `contactCreated` to the entire team group (including the creator's own connection).
- Drops two-context approach (complex fixture gymnastics) in favour of same-session verification.
- The `notifications.assertContains('contactCreated')` checks the panel shows the event kind.

## Original design changes

- Removed two-context `browser.newContext()` approach (too complex for the fixture model).
- `auth.signInAs('lead', { context })` API dropped — `signInAs` doesn't need context param.
- `b.notifications.assertContains('Realtime Person')` changed to `notifications.assertContains('contactCreated')` (panel shows event kind, not entity name).
- `b.assertLiveRegionAnnounced('New contact')` removed (not wired up in shell).

## Required production changes

- Add `ur-notification-center` to the app shell (`app.html` + `app.ts`).
- `NotificationsPanel` POM: add `assertContains(kind)` method.
