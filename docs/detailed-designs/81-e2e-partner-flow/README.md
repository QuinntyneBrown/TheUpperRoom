# 81 — E2E Partner Management Flow ✅ Accepted

**Traces to:** L2-063, L2-064. L1-005.

Vertical slice: partner create → view → update → associate contact → add note → change funnel stage → delete; assert on both list view and board view.

## Test (`tests/partners/partners-flow.spec.ts`)

```
test('partner lifecycle, association, stage change', async ({ auth, partners }) => {
  await auth.signInAs('city-lead');
  await partners.create({ name: 'Hope Church', city: 'Toronto' });
  await partners.associateContact('Pastor Joy');
  await partners.addNote('Initial outreach');
  await partners.changeStage();   // Lead → InFunnel
  await partners.assertListChip('In Funnel').showsPartner('Hope Church');
  await partners.openBoard();
  await partners.assertBoard('InFunnel').contains('Hope Church');
  await partners.update({ name: 'Hope Community Church' });
  await partners.delete('Hope Community Church');
});
```

## Design notes

- Stages are `Lead → InFunnel → Confirmed` (the API/enum values); display labels are "Lead", "In Funnel", "Confirmed".
- `changeStage()` clicks `stage-advance-btn` once to advance from Lead to InFunnel.
- `associateContact` uses the inline "Create & link" form in the partner contacts panel.
- `partners.create` requires both `name` and `city` (backend validates both).

## Acceptance tests

- L2-063 AC: partner CRUD with notes, contact association, and stage change is a single major flow.
- L2-064 AC: runs at `xs-mobile` and `lg-desktop` (board column layout differs).

## Radical simplicity notes

- One test, two assertions per surface (list and board) for the same partner.
- Drag-drop on the board is exercised in slice 86; this slice uses the stage advance button to keep the assertion deterministic.
