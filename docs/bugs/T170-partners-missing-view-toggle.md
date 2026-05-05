# T170 — Partners: missing list/board view toggle in header

**Status:** Open

## Description

The design (`Desktop / Partners - Board`, node `TsXov`) shows a `viewToggle` segment control next to the "Partners" title in the page header, allowing users to switch between the list view (`/partners`) and board/kanban view (`/partners/board`). Neither the list page nor the board page implements this toggle — there is no way to navigate between the two views from within either page.

## Design (ui-design.pen)

Header left section (`hO1mn`):
- "Partners" title (Geist 14px 600, #FFFFFF)
- `viewToggle` frame (`TsXov`): cornerRadius 6, fill `#0E0E16`, stroke `#2A2A3A`
  - `listBtn`: unselected state (no fill)
  - `boardBtn`: selected state (fill `#9F86FF`)

## Current Behaviour

- `/partners` (list): header shows "Partners" h1 + "+ Add partner" button only
- `/partners/board`: header shows "Partners" h1 + "New partner" button only
- No way to toggle between views

## Expected Behaviour

Both pages should have a view toggle in the header:
- A "List" tab linking to `/partners`
- A "Board" tab linking to `/partners/board`
- Active tab highlighted with `background: #9F86FF; color: #fff`
- Inactive tab with no background, muted text

## Failing Tests

`frontend/e2e/tests/partners/partners-view-toggle.spec.ts`
