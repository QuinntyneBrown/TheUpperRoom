# 86 — E2E Global Search Flow ✅ Accepted

**Traces to:** L2-063, L2-064. L1-012.

Vertical slice: create entities via UI → open search overlay → query → assert grouped results → select and navigate.

## Test (`tests/search/search-flow.spec.ts`)

```
test('global search across entity groups', async ({ auth, contacts, partners, hackathons, search }) => {
  await auth.signInAs('city-lead');
  await contacts.create({ name: 'Searchable Contact' });
  await partners.create({ name: 'Searchable Partner' });
  await hackathons.create({ title: 'Searchable Hackathon', startDate: '2026-09-01', endDate: '2026-09-03', hostCity: 'Toronto' });
  await search.open();
  await search.query('Searchable');
  await search.assertGroups(['Contacts', 'Partners', 'Hackathons']);
  await search.selectResult('Searchable Partner');
  await search.assertNavigatedTo(/\/partners\/[a-f0-9-]+$/);
});
```

## Acceptance tests

- L2-063 AC: search covers grouped results, selection, and navigation.
- L2-064 AC: lg-desktop (search overlay is desktop-first; mobile layout may vary).

## Radical simplicity notes

- Drops `seedData` fixture (not implemented) — seed data created via existing UI POMs instead.
- Mobile full-screen overlay test dropped (viewport detection is a CSS concern, not a flow concern).
- `search.open()` triggers the Ctrl+K keyboard shortcut.
- `assertNavigatedTo(pattern)` checks the URL rather than fetching the partner name from the DOM.

## Required production changes

- Add `ur-global-search-overlay` to the app shell.
- Add a search trigger button to the shell header (for E2E access without keyboard shortcut).
