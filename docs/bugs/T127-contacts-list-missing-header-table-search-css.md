# T127 — Contacts list: header, table, search, and pagination CSS missing

**Status**: Fixed

## Description

The contacts list page (`/contacts`) renders with no CSS for:
- `.contacts-list-page` — page container needs flex column layout
- `.contacts-list-page__header` — needs flex, space-between, bg-surface, border-bottom, padding
- `.contacts-list-page__header-left/right` — flex sub-layout for heading+subtitle / search+button
- `h1` inside header — should be `$fs-lg` (1.125rem), not the large browser-default h1
- `.contacts-list-page__subtitle` — muted, small font
- `.contacts-list-page__input` — search input needs surface background, border, padding
- `.contacts-list-page__table-wrap` — table container
- `.contacts-table` — table needs full-width, bg-surface, border-radius, border
- `.contacts-table thead` — bg-elevated header row
- `.contacts-table th, td` — padding, border-bottom, text alignment
- `.sort-btn` — sort button needs to look like plain text with icon
- `.contacts-pagination` — pagination needs flex layout

## Steps to reproduce

1. Navigate to `/contacts`
2. "Contacts" heading is large unstyled h1
3. Header has no background or border
4. Table has no border, no background, unstyled cells

## References
- Design: `Desktop / Contacts` → `RooEG` → `htop` (header) + `tbl` (table)
- Header: 64px, bg-surface, border-bottom-subtle, padding $sp-6 $sp-4
