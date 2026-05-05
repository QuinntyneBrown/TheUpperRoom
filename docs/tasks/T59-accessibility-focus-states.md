# T59 — Focus state coverage

**Status**: Accepted
**Phase**: 9 — Accessibility annotations
**Area**: Accessibility
**Requirements**: L1-015, L2-057, L2-059
**Source**: Screen-Level Missing Inventory — "Accessibility focus, keyboard ... annotations"

## Goal

Add a visible focus state to every interactive element in the design system, with AA-compliant contrast against every surface where the element appears.

## Scope

- Buttons (all variants), inputs, links, list items, side-nav items, bottom-nav items, cards (when actionable), tabs, chips/badges (when actionable), avatars (when actionable), notifications rows, widget chrome.
- Focus token: ring color, offset, width.
- "Focus-visible" treatment vs. "focus" treatment if differentiated.
- Validate ring contrast against every surface used.

## Acceptance criteria

- [ ] Every interactive component has a focus variant.
- [ ] Ring meets AA contrast everywhere.
- [ ] Focus token is monochromatic-compliant (T58).
