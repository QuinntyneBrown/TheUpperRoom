# 86 — E2E Global Search Flow

**Traces to:** L2-063, L2-064. L1-012.

Vertical slice: open global search overlay → query each entity group → select a result → navigate; assert mobile full-screen overlay.

## Test (`tests/search.spec.ts`)

```
test('global search across entity groups', async ({ auth, search, seedData }) => {
  await seedData.contacts.create({ name: 'Global Searchable Contact' });
  await seedData.partners.create({ name: 'Global Searchable Partner' });
  await seedData.hackathons.create({ title: 'Global Searchable Hackathon' });
  await auth.signInAs('city-lead');
  await search.open();
  await search.query('Global Searchable');
  await search.assertGroups(['Contacts', 'Partners', 'Hackathons']);
  await search.selectResult('Global Searchable Partner');
  await search.assertNavigatedToPartnerDetail('Global Searchable Partner');
});

test('mobile global search renders full-screen', async ({ search }) => {
  await search.openMobile();
  await search.assertOverlayCovers({ width: 375, height: 667 });
});
```

## Acceptance tests

- L2-063 AC: search major flow covers grouped results, selection, and navigation.
- L2-064 AC: mobile assertion runs on the `xs-mobile` project.

## Radical simplicity notes

- Seed data is created via the `seedData` fixture against the API, not through UI clicks, so the test stays focused on search.
