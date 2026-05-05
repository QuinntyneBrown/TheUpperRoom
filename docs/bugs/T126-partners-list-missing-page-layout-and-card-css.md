# T126 — Partners list: page layout and partner card CSS missing

**Status**: Fixed

## Description

The partners list page (`/partners`) renders with no CSS for the page container, header, list wrapper, or partner cards:
- `.partner-list-page` — needs flex column layout
- `.partner-list-page__header` — needs flex, space-between, padding, border-bottom, bg-surface
- `.partner-list-page__list` — needs flex column, gap, padding
- `.partner-card` — card link needs block display, padding, border separator, bg
- `.partner-card__meta` — needs muted color and smaller font

## Steps to reproduce

1. Navigate to `/partners`
2. The "Partners" heading and "+ Add partner" button render unstyled (no alignment or spacing)
3. Partner cards (when data loads) appear as unstyled inline links

## References
- Design: `Desktop / Partners` → `xbMBy` → `ptop` header + `pTable` card rows
