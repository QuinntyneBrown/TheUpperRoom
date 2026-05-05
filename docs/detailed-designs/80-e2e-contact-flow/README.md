# 80 — E2E Contact Management Flow

**Traces to:** L2-063, L2-064. L1-003.

Vertical slice: contact create → view → update → delete → restore (admin) → notes. Single test file using `ContactsPage` and the admin restore page.

## Test (`tests/contacts.spec.ts`)

```
test('contact lifecycle and notes', async ({ auth, contacts, admin }) => {
  await auth.signInAs('city-lead');
  await contacts.create({ name, email, phone });
  await contacts.assertOnDetail(name);
  await contacts.update({ name: 'Renamed' });
  await contacts.addNote('Met for coffee');
  await contacts.delete();
  await admin.signInAs('admin');
  await admin.deletedContacts.assertContains('Renamed');
  await admin.deletedContacts.restore('Renamed');
  await contacts.assertInList('Renamed');
});
```

## Acceptance tests

- L2-063 AC: covers contact CRUD and notes in one major flow.
- L2-064 AC: runs on the `xs-mobile` project at minimum (other viewports optional).

## Radical simplicity notes

- One test covers the full lifecycle. Splitting per CRUD verb would multiply fixture cost.
- Note add is the only note interaction in this flow; deeper note tests live with slice 12.
