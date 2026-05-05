# T52 — Administrator role management view

**Status**: Accepted
**Phase**: 6 — Team administration and authorization
**Area**: Authorization
**Requirements**: L1-002, L2-006
**Source**: Screen-Level Missing Inventory — "Administrator role management view"

## Goal

Provide an Administrator-only screen for assigning and revoking the Administrator role across the entire system.

## Scope

- `Desktop / Administrators`: list of users with the Administrator role; actions to add/remove.
- Search across all users.
- Confirmation dialog for revocation, especially when revoking the only active Administrator.
- Audit columns: granted by, granted at.

## Acceptance criteria

- [ ] Administrators list screen and add/revoke flows designed.
- [ ] Last-administrator constraint warning designed.
- [ ] Reachable only by Administrators (annotated).
