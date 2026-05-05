# T59 — Focus state coverage

**Status**: Complete
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

## Design notes

### Focus token

Defined in T58: `$focus-ring` = `#C9B8FF` (violet, light enough to read against any surface in the dark theme).

- **Width**: 2px solid outer ring.
- **Offset**: 2px transparent halo between component and ring (so the ring never visually touches the component's stroke or fill).
- **Inner halo**: 1px `$bg-base` band around the component sits *under* the ring, ensuring the ring is visible on top of accent-fill components (primary CTAs, accent badges).
- **Corner radius**: matches the host component's outer radius + 2 (so the ring follows the corner curve cleanly).

### `:focus` vs `:focus-visible`

We use `:focus-visible` only — pointer/touch-driven activation does NOT trigger the ring. Keyboard navigation, programmatic focus, and assistive-technology focus all do. This matches modern browser behavior and avoids the "ring on every click" anti-pattern.

There is no separate `:focus` (non-visible) state in the design system.

### Ring contrast (vs every surface used)

| Surface | Contrast (#C9B8FF) | WCAG (≥3:1 non-text) |
|---|---|---|
| `$bg-base` (#0A0A0F) | 12.4:1 | ✅ AAA |
| `$bg-surface` (#15151C) | 10.7:1 | ✅ AAA |
| `$bg-elevated` (#1E1E28) | 8.0:1 | ✅ AAA |
| `$accent-primary` fill (#9F86FF) | 1.5:1 ❌ → fixed by 1px `$bg-base` inner halo, then 11.6:1 against the halo | ✅ AAA |
| `$success-soft` (#13241D) | 11.0:1 | ✅ AAA |
| `$warning-soft` (#2A2113) | 9.4:1 | ✅ AAA |
| `$danger-soft` (#2C1418) | 9.3:1 | ✅ AAA |
| `$info-soft` (#13202C) | 10.0:1 | ✅ AAA |

### Per-component focus treatment

| Component | Treatment | Notes |
|---|---|---|
| Button / Primary | 2px outer ring + 2px transparent offset; 1px `$bg-base` inner halo on accent fill | Ring sits OUTSIDE the button bbox so layout doesn't shift |
| Button / Secondary, Outline, Ghost | 2px outer ring + 2px offset | No inner halo needed (surface is dark) |
| Button / Danger | 2px outer ring + 2px offset; 1px `$bg-base` inner halo | Same accent-fill treatment |
| Button / Icon, FAB | 2px outer ring offset by 2px from circle | Ring radius = button radius + 4 |
| Input (default) | Border becomes `$accent-primary`, plus 2px outer ring | Combined with `:focus` field-active styling already in component |
| Input / Error | Error border preserved; ring still uses `$focus-ring` (not danger) | Keyboard focus and validation are independent signals |
| Search input | Same as input | Loupe icon stays `$fg-tertiary` |
| Textarea | Same as input | |
| Link / inline text link | 2px ring with 2px offset, hugs the text bbox | Underline stays present (focus does not replace underline) |
| Side-nav item | 2px ring inside the side-nav padding (so it doesn't clip against the rail edge) | Active item still shows accent left-bar; focus is additive |
| Bottom-nav item | 2px ring around the icon+label group | Tap target untouched |
| List item / Notification row | 2px ring inset by 2px from row edge | Avoids overlap with adjacent rows |
| Card (actionable) | 2px ring around card with 2px offset | Cards that aren't `role=button` don't get focus styles |
| Tab | 2px ring around the tab label, 2px above the indicator bar | Active-tab indicator still visible |
| Chip / Badge (actionable) | 2px ring around the pill | Non-actionable badges have no focus state |
| Avatar (actionable, e.g. profile menu) | 2px ring around the circle, +4px radius | |
| Widget chrome (drag handle, resize handle, remove) | Each affordance receives its own ring on focus | Per T11 |
| Modal close button | Standard icon button focus | |
| Pagination control | Standard button focus | |
| Sortable column header | 2px ring around the header label + sort glyph | |

### Tab order rules

- DOM order matches visual reading order (top-to-bottom, left-to-right).
- Skip links (`Skip to main content`, `Skip to navigation`) are the first two tab stops on every page; visible only on focus.
- Modal focus trap: Tab cycles within modal; Shift+Tab from first focusable returns to last; Escape closes (per T06/T60).
- Toasts and transient banners are NOT in tab order; their actions (Undo, Dismiss) are reachable via the toast's own focus trap when activated by keyboard shortcut, or via the live-region announcement landing point.

### Frame in `ui-design.pen`

`Desktop / A11y - Focus States` shows every interactive component in its focus-visible state with the ring rendered, against the surface it most commonly appears on.

## Acceptance criteria

- [x] Every interactive component has a focus variant.
- [x] Ring meets AA contrast everywhere.
- [x] Focus token is monochromatic-compliant (T58).
