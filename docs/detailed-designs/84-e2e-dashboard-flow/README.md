# 84 — E2E Dashboard Widget Flow

**Traces to:** L2-063, L2-064. L1-007.

Vertical slice: empty dashboard → add → move → resize → remove → persist → restore. Runs on multiple viewports.

## Test (`tests/dashboard.spec.ts`)

```
test('dashboard widget lifecycle and persistence', async ({ auth, dashboard }) => {
  await auth.signInAs('city-lead');
  await dashboard.assertEmpty();
  await dashboard.addWidget('kpi');
  await dashboard.addWidget('line-chart');
  await dashboard.dragWidget('line-chart', { x: 6, y: 0 });
  await dashboard.resizeWidget('line-chart', { cols: 6, rows: 4 });
  await dashboard.removeWidget('kpi');
  await auth.signOut();
  await auth.signIn();
  await dashboard.assertWidgetAt('line-chart', { x: 6, y: 0, cols: 6, rows: 4 });
});
```

## Acceptance tests

- L2-063 AC: full widget lifecycle in one flow.
- L2-064 AC: runs at `xs-mobile` (assertions skip the resize step where resize is disabled) and `lg-desktop` (full step set).

## Radical simplicity notes

- One test, two viewport projects. Resize is conditionally skipped on `xs` rather than forking the test.
- The same `DashboardPage` covers add, drag, resize, and remove via small typed methods.
