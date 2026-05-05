# T39 — Remove contact association

**Status**: Accepted
**Phase**: 5 — Partner and hackathon management
**Area**: Partner, Contacts
**Requirements**: L1-004, L2-018
**Source**: Screen-Level Missing Inventory — "Remove contact association"

## Goal

Allow the user to detach a contact from a partner without deleting the contact.

## Scope

- Per-row action on the partner contacts list (overflow menu or trailing icon).
- Confirmation dialog: "Remove <contact name> from <partner>?" with copy that clarifies the contact is not deleted.
- Toast with Undo on success.
- Permission-gated absent state.

## Acceptance criteria

- [ ] Row action and confirmation dialog designed.
- [ ] Copy distinguishes "remove association" from "delete contact".
- [ ] Mobile variant per T21.
