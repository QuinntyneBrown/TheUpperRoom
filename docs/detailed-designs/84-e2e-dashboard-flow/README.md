# 84 — E2E Dashboard Widget Flow ✅ Accepted

**Traces to:** L2-063, L2-064. L1-007.

Vertical slice: empty dashboard → add → remove → persist across sessions.

## Test (`tests/dashboard/dashboard-flow.spec.ts`)

```
test('dashboard widget lifecycle and persistence', async ({ auth, dashboard }) => {
  await auth.signInAs('city-lead');
  await dashboard.goto();
  await dashboard.assertEmpty();
  await dashboard.addWidget('kpi');
  await dashboard.addWidget('line-chart');
  await dashboard.removeWidget('kpi');
  await auth.signOut();
  await auth.signInAs('city-lead');
  await dashboard.goto();
  await dashboard.assertHasWidget('line-chart');
  await dashboard.assertNoWidget('kpi');
});
```

## Acceptance tests

- L2-063 AC: full widget lifecycle in one flow — add, remove, persist.
- L2-064 AC: runs at `lg-desktop`.

## Radical simplicity notes

- Drag/resize dropped: gridster2 mouse-event pixel math is brittle across viewports and grid cell sizes. Persistence is verified by presence/absence, not position.
- `auth.signOut()` + `auth.signInAs('city-lead')` re-establishes city-lead session cleanly (signInAs re-seeds).
- One test. Add two widgets, remove one, verify only the kept one persists after re-login.

## Original design changes

- Removed `dragWidget` / `resizeWidget` / `assertWidgetAt` (brittle pixel math).
- `auth.signIn()` (no args) replaced with `auth.signInAs('city-lead')`.
- Added `assertHasWidget` / `assertNoWidget` POM methods.
