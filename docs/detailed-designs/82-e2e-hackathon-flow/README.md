# 82 — E2E Hackathon Management Flow ✅ Complete

**Traces to:** L2-063, L2-064. L1-006.

Depends on slice 44 (update) and slice 45 (delete/restore).

## Test (`tests/hackathons.spec.ts`)

```
test('hackathon lifecycle, 4Ds stage, products, partners', async ({ auth, hackathons, partners }) => {
  await auth.signInAs('city-lead');
  await partners.create({ name: 'Hope Church' });
  await hackathons.create({ title: 'Toronto 2025', startDate, endDate, hostCity: 'Toronto', partnerIds: ['Hope Church'] });
  await hackathons.assertOnDetail('Toronto 2025');
  await hackathons.update({ title: 'Toronto 2026' });
  await hackathons.changeStage('Define');
  await hackathons.changeStage('Design');
  await hackathons.addProduct({ title: 'Outreach App', description: 'PWA' });
  await hackathons.delete();
  await admin.deletedHackathons.restore('Toronto 2026');
});
```

## Acceptance tests

- L2-063 AC: full hackathon CRUD plus 4 D's stage and products in one major flow.
- L2-064 AC: runs at `lg-desktop` (the 4 D's tracker is a desktop-first surface).

## Radical simplicity notes

- One test, sequential interactions. Stage and product additions are minimal — a single product, a single stage transition pattern.
