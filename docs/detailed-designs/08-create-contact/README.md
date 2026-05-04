# 08 — Create Contact

**Traces to:** L2-009 (L1-003).

## Components
- Backend `Contacts/CreateContact.cs` — `CreateContactCommand : ITeamScopedRequest { TargetTeamId, FirstName, LastName, Email?, Phone?, City? }` + handler that inserts a `Contact` row, returns `{ id }`.
- Backend `ContactsController.Create` — `POST /api/contacts`, `[Authorize(Roles="Admin,CityLead,PrayerLead,EventLead,CommunicationLead")]`.
- Backend `Contacts/CreateContactValidator.cs` — FluentValidation rules.
- Frontend `feature-contacts/contact-form` (used for create + update) reactive form. Submits via `CONTACT_SERVICE.create(...)`.
- Frontend `feature-contacts/contact-create-page` route `/contacts/new`.

## Workflow
![Sequence](diagrams/sequence_create.png)

## API
| Method | Path | Body | Response |
|---|---|---|---|
| POST | `/api/contacts` | `{ firstName, lastName, email?, phone?, city? }` | `201 { id }` / `400` |

## Validation
- `FirstName`, `LastName`: required, ≤100 chars.
- `Email`: optional; if present, valid email.
- `Phone`: optional; if present, E.164 or local format (regex).
- `City`: optional, ≤100 chars.

## Acceptance test
```ts
// Acceptance Test
// Traces to: L2-009
test('city lead creates a contact', async ({ page }) => {
  await page.goto('/contacts/new');
  await contactForm.fill({ firstName: 'Ava', lastName: 'Lee' });
  await contactForm.submit();
  await expect(page).toHaveURL(/\/contacts\/[a-f0-9-]+/);
});
```

## Radical simplicity notes
- `TargetTeamId` is set automatically by the controller from `CurrentUser.TeamId`. The user does not pass it.
- One handler; no service class between controller and handler.
