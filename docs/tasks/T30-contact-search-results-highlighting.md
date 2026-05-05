# T30 — Contact-specific search results with highlighting

**Status**: Accepted
**Phase**: 4 — Contact lifecycle
**Area**: Contacts, Search
**Requirements**: L1-011, L2-014, L2-043
**Source**: Screen-Level Missing Inventory — "Contact-specific search results with snippets/highlighting"

## Goal

Within both the contacts list and the global search dialog, contact results should show match snippets with highlighted query terms.

## Scope

- Contact result row design: name with highlighted match, role/partner subline, email/phone snippet with highlight if matched.
- Note-content match: 1-line snippet with highlighted term and a "from <author>, <date>" subline.
- Highlight token: bold + underline OR accent background; choose one and apply consistently.

## Acceptance criteria

- [ ] Contact result variant designed for both contacts list search and global search.
- [ ] Highlight style meets AA contrast on the dark theme.
- [ ] Multi-match snippet behavior documented (truncation, ellipsis).
