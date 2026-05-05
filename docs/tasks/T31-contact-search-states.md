# T31 — Contact search loading/empty/error states

**Status**: Complete
**Phase**: 4 — Contact lifecycle
**Area**: Contacts, Search
**Requirements**: L1-011, L2-014
**Source**: Screen-Level Missing Inventory — "Contact search minimum-length/loading/empty/error states"

## Goal

Cover every state of the contacts-list search field.

## Scope

- Min-length hint state: "Type at least 2 characters" prompt.
- Loading state: spinner inside or beside the field.
- Empty/no-results state: clear copy and reset link.
- Error state: retry copy with reload icon.
- Cleared state: returns to default list.

## Acceptance criteria

- [x] All four states represented as variants of the contacts search field/component.
- [x] States compose cleanly with filters and pagination.
