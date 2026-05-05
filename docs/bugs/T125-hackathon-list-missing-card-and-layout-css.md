# T125 — Hackathon list: page layout and card CSS missing

**Status**: Fixed

## Description

The hackathon list page (`/hackathons`) renders cards as unstyled inline `<a>` links with no visual separation. All four CSS classes are undefined:
- `.hackathon-list-page` — page container needs flex column layout
- `.hackathon-list-page__header` — header needs flex, space-between, border-bottom
- `.hackathon-card` — card link needs block display, padding, border, border-radius, background
- `.hackathon-card__meta` — meta text needs smaller font size and muted color

## Steps to reproduce

1. Navigate to `/hackathons`
2. Hackathon entries appear as a wall of inline linked text with no visual card structure

## References
- No separate "Hackathon List" design frame; modelled on contacts-list and partner-card patterns from the design system
