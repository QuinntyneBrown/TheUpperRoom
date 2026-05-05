# T169 — Partner list: items are flat rows with dividers, not styled cards

**Status:** Open

## Description

The partners list page renders each partner as a flat row with a `border-bottom` divider and no background. The design (`Desktop / Partners`, list items `P69eaq` / `idGWV`) specifies individual card items with `cornerRadius: $radius-md`, `fill: $bg-surface`, `stroke: $border-subtle`, and a horizontal layout with the partner name on the left and stage on the right.

## Design (ui-design.pen)

List items (`P69eaq` / `idGWV`):
- Horizontal auto-layout: name | spacer | stage text
- `cornerRadius: $radius-md` (8px)
- `fill: $bg-surface` (#101018 / bg-elevated)
- `stroke: {fill: $border-subtle, thickness: 1}` (#222233)
- `padding: $sp-3` (12px)
- `gap: $sp-3` (12px)

List container:
- `gap: $sp-2` (8px) between items
- `padding: $sp-8` (32px)

## Current Behaviour

- `.partner-card`: `flex-direction: column`, transparent background, only `border-bottom` divider
- Color tokens use Slate fallbacks (`#334155`, `#1e293b`) instead of design's dark palette

## Expected Behaviour

- `.partner-card`: `flex-direction: row`, `align-items: center`, card background + border, `border-radius: 8px`
- Stage text right-aligned (via `flex: 1` spacer)
- Correct color tokens throughout

## Failing Tests

`frontend/e2e/tests/partners/partner-list-card-styling.spec.ts`
