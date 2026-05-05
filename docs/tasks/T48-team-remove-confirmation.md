# T48 — Team remove member confirmation

**Status**: Complete
**Phase**: 6 — Team administration and authorization
**Area**: Team
**Requirements**: L1-006, L2-028
**Source**: Screen-Level Missing Inventory — "Team remove member confirmation"

## Goal

Add a destructive confirmation for removing a team member, with handling for protected higher-role rejection.

## Scope

- Confirmation dialog: "Remove <name> from <city> team?" with consequences listed.
- Side effects: their session ends, contributions remain, role removed.
- Higher-role rejection state ("Only an Administrator can remove a City Lead").
- Toast on success.

## Acceptance criteria

- [x] Confirmation dialog and rejection state designed.
- [x] Mobile variant per T21.
