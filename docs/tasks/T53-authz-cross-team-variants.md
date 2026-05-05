# T53 — Cross-team restricted/public/admin variants

**Status**: Accepted
**Phase**: 6 — Team administration and authorization
**Area**: Authorization
**Requirements**: L1-002, L2-006, L2-007, L2-008
**Source**: Screen-Level Missing Inventory — "Cross-team restricted/public/admin variants" + "disabled/hidden unauthorized actions"

## Goal

Define how UI changes when a user views entities outside their own team or lacks specific permissions.

## Scope

- Restricted view: cross-team partner/contact detail showing only public summary fields.
- Hidden vs. disabled action treatment standard (decide one default per action class and document).
- Tooltip explaining "You don't have permission to perform this action".
- Administrator full-detail variant on cross-team entities.
- Permission-gated subnav and overflow menu items.

## Design notes

### Hidden vs. disabled standard

Per action class, the default treatment is:

| Action class                          | Cross-team Restricted | Cross-team Admin override | In-team without role |
|---------------------------------------|------------------------|---------------------------|----------------------|
| **Destructive** (delete, revoke, archive) | hidden               | shown enabled              | shown disabled with tooltip |
| **Edit** (rename, change stage, update fields) | hidden     | shown enabled (audit-logged) | shown disabled with tooltip |
| **Create new** (add contact, invite, new partner) | hidden     | shown enabled              | shown disabled with tooltip |
| **Read PII** (email, phone, notes, member roster) | hidden + lock affordance | shown enabled (audit-logged) | shown enabled |
| **Read public summary** (name, stage, partner count) | shown enabled | shown enabled | shown enabled |
| **Subnav: Audit log, Admin tools** | hidden | shown enabled | hidden |

Rule: **destructive and edit actions are always hidden cross-team for non-admins**, never shown disabled, to keep cross-team UIs uncluttered. **Within a team**, missing-role actions are shown disabled with a lock icon and tooltip so users learn the role boundaries.

### Standard tooltip copy

| Surface                          | Copy                                                                                  |
|----------------------------------|---------------------------------------------------------------------------------------|
| Disabled action (in-team)        | "You don't have permission to perform this action. Ask {role-required} or an Admin."  |
| Locked PII row (cross-team)      | "Hidden cross-team. Members of {team-name} and Administrators can view this."         |
| Cross-team browsing banner       | "This {entity} belongs to {team-name}. You see public-safe fields only."              |
| Admin override banner            | "Administrator override · audit-logged. Local {team-name} City Lead is notified of edits." |

### Frames in this task

- `Desktop / Cross-team Partner - Restricted` and `Desktop / Cross-team Partner - Admin`
- `Desktop / Cross-team Contact - Restricted` and `Desktop / Cross-team Contact - Admin`
- `Desktop / Cross-team Team - Restricted` and `Desktop / Cross-team Team - Admin`

These pair with the in-team detail screens already covered by T24/T32/T17 and the global teams list/detail in T50.

## Acceptance criteria

- [ ] Restricted, public, and admin variants designed for at least: partner detail, contact detail, team detail.
- [ ] Hidden/disabled standard documented in design notes.
- [ ] Tooltip copy is consistent across the app.
