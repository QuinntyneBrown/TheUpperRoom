# T163 — Team page: header not styled, title and actions not in a topbar row

**Status:** Open

## Description

The team page (`/team`) renders its header as a block stack — the "Team" H1 appears alone, then the "Manage roles" and "+ Invite member" action buttons appear below it on the next line. The component has no CSS for `.team-page__header`, `.team-page__title`, or `.team-page__header-actions`.

## Design (ui-design.pen)

Frame: `Desktop / Team` (Epzpe) — topbar node `dSV7m`:
- `height: 64`, `fill: $bg-elevated`, `border-bottom: 1px $border-subtle`
- `justifyContent: space_between`, `alignItems: center`, `padding: [$sp-6, $sp-4]`
- Left: title "Team · {City}" (`$font-heading`, 18px, 600, `$fg-primary`)
- Right: "Manage roles" + "+ Invite member" buttons

## Current Behaviour

- "Team" H1 sits as a block element with no styling.
- Action buttons render in a div directly below the H1, not side-by-side in a header bar.
- No topbar background, border, or fixed height.

## Expected Behaviour

Styled topbar: title and buttons in one row, `$bg-elevated` background, `$border-subtle` bottom border.

## Failing Tests

`frontend/e2e/tests/team/local-team-header.spec.ts`
