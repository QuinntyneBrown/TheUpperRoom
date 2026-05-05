# 45 — Delete and Restore Hackathon ✅ Complete

**Traces to:** L2-063, L2-008, L2-044. L1-006, L1-002.

Vertical slice: soft-delete a hackathon and restore it from the admin audit page. Mirrors the contact pattern (slice 11 + slice 41).

## Components

- Backend `Hackathon` entity gets a `DeletedAt` nullable timestamp; `AppDbContext` adds `entity.HasQueryFilter(h => h.DeletedAt == null)`.
- Backend `Hackathons/DeleteHackathon.cs` — sets `DeletedAt = clock.UtcNow`. `[Authorize(Roles="Admin,CityLead")]`.
- Backend `Admin/ListDeletedHackathons.cs` and `Admin/RestoreHackathon.cs` mirror the contact admin endpoints.
- Backend audit log entry written on delete and restore (slice 60: `hackathonDeleted`, `hackathonRestored`).
- Frontend hackathon detail overflow menu adds "Delete" using the existing `confirmDel` dialog.
- Frontend admin section adds `/admin/hackathons/deleted` page (clone of slice 41 for hackathons).

## API

| Method | Path | Auth | Response |
|---|---|---|---|
| DELETE | `/api/hackathons/{id}` | Admin/CityLead | `204` |
| GET | `/api/admin/hackathons/deleted` | Admin | `200 [...]` |
| POST | `/api/admin/hackathons/{id}/restore` | Admin | `200` |

## Acceptance tests

- L2-063: delete removes from list, search, and partner board; restore brings it back.
- L2-008: Lead/Volunteer cannot delete (403).
- L2-044: delete and restore each emit an audit log entry with actor, target, timestamp.

## Radical simplicity notes

- Same `DeletedAt` pattern as contacts. No bespoke recycle-bin abstraction.
- Restore endpoint reuses `IgnoreQueryFilters()` query. No separate deleted entity table.
