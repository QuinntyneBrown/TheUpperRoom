# 44 — Update Hackathon Details ✅ Complete

**Traces to:** L2-063 (CRUD coverage), supports L2-022/L2-025. L1-006.

Vertical slice: edit a hackathon's title, dates, host city, and partner associations. Stage and products live in slices 22/23.

## Components

- Backend `Hackathons/UpdateHackathon.cs` — `UpdateHackathonCommand : ITeamScopedRequest { Id, Title, StartDate, EndDate, HostCity, PartnerIds[] }`. Handler loads hackathon, validates dates (`End >= Start`), replaces partner associations in a single `SaveChanges`.
- Backend `HackathonsController` adds `PUT /api/hackathons/{id}`. `[Authorize(Roles="Admin,CityLead")]`.
- Frontend `feature-hackathons/hackathon-edit-page` — route `/hackathons/{id}/edit`. Reuses the same form component as create (slice 21) bound to existing values.
- Frontend "Edit" button on the detail page opens the edit page; Save returns to detail.

## API

| Method | Path | Auth | Body | Response |
|---|---|---|---|---|
| PUT | `/api/hackathons/{id}` | Admin/CityLead | `{ title, startDate, endDate, hostCity, partnerIds[] }` | `200 { id }` |

## Validation

- `Title` 1–120 chars.
- `EndDate >= StartDate`.
- `PartnerIds[]` must all belong to the same team (database constraint by team scope).

## Acceptance tests (L2-063)

- Admin/CityLead edits all fields → detail reflects new values.
- Lead role attempts edit → 403.
- `EndDate < StartDate` → 400 with field error on `endDate`.
- Removed partner association no longer appears on the detail page.

## Radical simplicity notes

- Reuses the create form component verbatim; only the submit handler differs.
- Partner associations are replaced wholesale — no add/remove diff logic.
- No optimistic concurrency token; last-write-wins matches the rest of the app.
