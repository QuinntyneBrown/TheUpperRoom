# T167 — Hackathon detail: 4 D's cards render as vertical column instead of horizontal row

**Status:** Fixed ✓

## Description

The hackathon detail page renders the four D's stage cards (Discover, Design, Develop, Deploy) as a vertical stack. The design (`Desktop / Hackathons`, node `m6ysnu` / fourD) specifies a horizontal row with `gap: 16`.

Additionally several card style tokens are wrong — border-radius, background, border and accent colours all use placeholder values instead of the design system tokens.

## Design (ui-design.pen)

Node `m6ysnu` (fourD):
- `gap: 16`, `width: fill_container`, no `layout` property → horizontal auto-layout
- 4 children (d1–d4) each `width: fill_container` (equal share)

Each d-card:
- `cornerRadius: 8`, `fill: #101018` (bg-elevated), `gap: 16`, `padding: 20`
- Active/Done stroke: `{fill: #9F86FF, thickness: 1}` (accent-primary)
- Upcoming stroke: `{fill: #222233, thickness: 1}` (border-subtle)

D-marker (36×36, cornerRadius 8):
- Active/Done: `fill: #1A1432` (accent-soft), border `#9F86FF`
- Upcoming: muted (bg-elevated, border-default)

## Current Behaviour

- `.four-d-cards`: `flex-direction: column` → vertical stack
- `border-radius: 12px` (should be 8px)
- `background: #1e293b` (should be `#101018`)
- `gap: 12px` (should be 16px)
- Accent colours use `#6366f1` (Indigo) instead of `#9f86ff`
- Marker accent bg `rgba(99,102,241,0.15)` instead of `#1a1432`

## Expected Behaviour

- `.four-d-cards`: `flex-direction: row`, all four cards side by side
- `border-radius: 8px`
- `background: var(--ur-bg-elevated, #101018)`
- `gap: 16px` between cards
- Correct accent token `#9f86ff` throughout

## Failing Tests

`frontend/e2e/tests/hackathons/hackathon-four-d-cards-layout.spec.ts`
