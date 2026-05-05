# T129 — Global Teams page: both table and cards render simultaneously; all layout CSS missing

**Status**: Fixed

## Description

The `/teams` page (Global Teams) has two structural issues:

1. **Duplicate views**: Both `teams-table` (desktop table) and `teams-cards` (mobile card list) render simultaneously with no responsive visibility logic, resulting in all data showing twice.

2. **Missing CSS**: No CSS for page container, header, title, search input, table, or cards:
   - `.global-teams-page` — page container
   - `.global-teams-page__header` — header layout
   - `.global-teams-page__title` — h1 font size
   - `.global-teams-page__search / __search-input` — search bar
   - `.teams-table` — table styling
   - `.teams-cards / .team-card` — card grid

## Fix

- Add `display: none` / `display: block` responsive breakpoint logic (desktop: table, mobile: cards)
- Add all missing CSS

## References
- Route: `/teams`
- Design: `Desktop / Teams` frame (if exists)
