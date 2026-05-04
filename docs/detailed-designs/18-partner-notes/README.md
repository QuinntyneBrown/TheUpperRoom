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
Same shape as L2-013, applied to a partner.

## Radical simplicity notes
- One polymorphic `Note` table, one panel component, one set of edit/delete rules. The "Partner notes feature" is essentially three new lines: a route, a component-input switch, and a controller action.

## Open Questions
None.
