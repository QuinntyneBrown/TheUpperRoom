# T26 — Contact concurrency conflict state

**Status**: Complete
**Phase**: 4 — Contact lifecycle
**Area**: Contacts
**Requirements**: L1-003, L2-011
**Source**: Screen-Level Missing Inventory — "Contact concurrency conflict state"

## Goal

Show what the user sees when their contact edit collides with a concurrent edit on the server.

## Scope

- Conflict dialog/banner shown after Save returns a 409.
- Side-by-side or stacked diff of conflicting fields with "Use mine"/"Use theirs"/"Merge" options.
- Refresh-and-retry path that discards the user's changes.
- Toast on resolution.

## Acceptance criteria

- [x] Conflict resolution UI exists for the contact edit form.
- [x] Diff is readable on the dark theme with AA contrast.
- [x] Mobile variant per T16/T21.
