# 41 — Contact Audit and Restore View ✅ Complete

**Traces to:** L2-012 (refinement of slice 11). L1-003.

Vertical slice: an Administrator-only page that lists soft-deleted contacts and restores them. Slice 11 already implements the soft delete itself; this slice isolates the audit/restore UI and its acceptance tests.

## Components

- Backend `Admin/ListDeletedContacts.cs` — `Query { TeamId? }` returns deleted contacts (`Contact.DeletedAt != null`) using `IgnoreQueryFilters()`. Admin-only.
- Backend `Admin/RestoreContact.cs` already exists from slice 11 — `POST /api/admin/contacts/{id}/restore` clears `DeletedAt`.
- Backend `AdminController` adds `GET /api/admin/contacts/deleted`.
- Frontend `feature-admin/deleted-contacts-page` — single route `/admin/contacts/deleted`, route guard `roles: ['Administrator']`. Renders one table: name, deleted at, original team, Restore button.
- Frontend reuses existing `confirm-restore` dialog (one-button confirm, no new component).

## API

| Method | Path | Auth | Response |
|---|---|---|---|
| GET | `/api/admin/contacts/deleted` | Admin | `200 [{ id, name, deletedAt, originalTeam }]` |
| POST | `/api/admin/contacts/{id}/restore` | Admin | `200` |

## Acceptance tests (L2-012 AC3)

- Admin opens `/admin/contacts/deleted` → sees soft-deleted contacts.
- Non-admin navigates to route → guard redirects, API returns 403.
- Admin clicks Restore → contact reappears in default list and search; row leaves the audit view.

## Radical simplicity notes

- One list query + one existing command. No paging until the audit view actually exceeds a page.
- No separate "trash" entity; soft delete + `IgnoreQueryFilters()` is the audit query.
- No bulk restore. One row at a time keeps confirm UX trivial.
