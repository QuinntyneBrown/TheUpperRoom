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

## Acceptance criteria

- [ ] Restricted, public, and admin variants designed for at least: partner detail, contact detail, team detail.
- [ ] Hidden/disabled standard documented in design notes.
- [ ] Tooltip copy is consistent across the app.
