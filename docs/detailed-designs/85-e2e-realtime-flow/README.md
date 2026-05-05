# 85 — E2E Realtime Notification Flow

**Traces to:** L2-063. L1-008.

Vertical slice: two simulated clients in the same team — one acts, the other receives the SignalR event, the notification center updates, and the live region announces.

## Test (`tests/realtime.spec.ts`)

```
test('realtime contact created delivered to second client', async ({ browser, auth }) => {
  const ctxA = await browser.newContext();
  const ctxB = await browser.newContext();
  const a = await auth.signInAs('lead', { context: ctxA });
  const b = await auth.signInAs('lead', { context: ctxB });
  await b.notifications.open();
  await a.contacts.create({ name: 'Realtime Person' });
  await b.notifications.assertContains('Realtime Person');
  await b.assertLiveRegionAnnounced('New contact');
});
```

## Acceptance tests

- L2-063 AC: a realtime delivery flow exists between two contexts in the same team.
- Asserts the live region content and the notification panel content within 2 s of the action.

## Radical simplicity notes

- Two browser contexts in one process. No cross-machine harness.
- Reuses `contactCreated` from slice 51 — no flow-only test event.
