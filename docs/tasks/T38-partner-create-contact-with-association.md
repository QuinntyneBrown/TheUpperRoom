# T38 — Create-and-associate contact from partner

**Phase**: 5 — Partner and hackathon management
**Area**: Partner, Contacts
**Requirements**: L1-004, L2-018
**Source**: Screen-Level Missing Inventory — "Create contact from partner screen"

## Goal

Allow the user to create a new contact from within partner context, automatically associating it with the partner on save.

## Scope

- Entry point: secondary action in the picker dialog (T37) — "+ New contact".
- Reuses the New Contact dialog (T28) with the partner field pre-filled and locked.
- Save returns to partner detail with a confirmation toast.

## Acceptance criteria

- [ ] Entry point and pre-filled-locked partner field designed.
- [ ] Save behavior documented (creates contact + association atomically).
- [ ] Mobile variant per T21.
