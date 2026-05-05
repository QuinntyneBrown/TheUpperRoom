# 18 — Partner Notes

**Traces to:** L2-019 (L1-004).

Reuses the `Note` entity, controller actions from slice 12; only routes and the `notes-panel` consumer differ.

## Components
- Backend `NotesController` already exists from slice 12. Adds `POST /api/partners/{id}/notes`. `PUT/DELETE /api/notes/{noteId}` are shared.
- Frontend `feature-partners/partner-detail-page` mounts the same `notes-panel` component (passed `targetType="Partner"`).

## API
| Method | Path | Notes |
|---|---|---|
| POST | `/api/partners/{id}/notes` | body `{ body }` |

## Acceptance tests (L2-019)
- Add a 1–4000 character note to a partner in the actor's team; it appears at the top immediately.
- Author can edit/delete their own partner note.
- Non-author non-Admin/CityLead editing/deleting another user's partner note receives 403.
- Admin or CityLead can edit/delete any partner note in their team.
- Adding a note to a partner outside the actor's team is rejected by team scope.
- The `noteAdded` event includes event type, entity ID, actor ID, and timestamp.

## Radical simplicity notes
- One polymorphic `Note` table, one panel component, one set of edit/delete rules. The "Partner notes feature" is essentially three new lines: a route, a component-input switch, and a controller action.

## Open Questions
None.
