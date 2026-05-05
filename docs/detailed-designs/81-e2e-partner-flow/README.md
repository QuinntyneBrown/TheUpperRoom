# 81 — E2E Partner Management Flow

**Traces to:** L2-063, L2-064. L1-005.

Vertical slice: partner create → view → update → associate contact → add note → change funnel stage → delete; assert on both list view and board view.

## Test (`tests/partners.spec.ts`)

```
test('partner lifecycle, association, stage change', async ({ auth, contacts, partners }) => {
  await auth.signInAs('city-lead');
  const contact = await contacts.create({ name: 'Pastor Joy' });
  await partners.create({ name: 'Hope Church' });
  await partners.associateContact('Pastor Joy');
  await partners.addNote('Initial outreach');
  await partners.changeStage('Engaged');
  await partners.assertListChip('Engaged').showsPartner('Hope Church');
  await partners.openBoard();
  await partners.assertBoard('Engaged').contains('Hope Church');
  await partners.update({ name: 'Hope Community Church' });
  await partners.delete('Hope Community Church');
});
```

## Acceptance tests

- L2-063 AC: partner CRUD with notes, contact association, and stage change is a single major flow.
- L2-064 AC: runs at `xs-mobile` and `lg-desktop` (board column layout differs).

## Radical simplicity notes

- One test, two assertions per surface (list and board) for the same partner.
- Drag-drop on the board is exercised in slice 86; this slice uses the stage menu to keep the assertion deterministic.
