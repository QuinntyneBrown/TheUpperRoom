# T14 — Touch chart interactions

**Status**: Complete
**Phase**: 2 — Dashboard editor interaction model
**Area**: Dashboard, Responsive
**Requirements**: L1-007, L1-009, L2-034, L2-039
**Source**: Screen-Level Missing Inventory — "touch chart interactions"

## Goal

Define how a user inspects, scrubs, and reads chart values on touch devices where hover does not exist.

## Scope

- Tap-to-reveal data point tooltip with persistent dismiss.
- Long-press to scrub across the series.
- Pinch-to-zoom or pagination for dense series (decide one).
- Legend interaction: tap to toggle a series.
- States across mobile and tablet chart cards.

## Design notes

- **Tap to inspect** (`Mobile / Chart - Tap Tooltip`, `Tablet / Chart - Tap Tooltip`): a single tap on a bar selects it (highlighted in `$accent-tertiary`) and opens a persistent tooltip with date, value, and trend. The tooltip carries an explicit 24/28 px close button so dismissal does not require tapping outside (which is unreliable on mobile).
- **Long-press to scrub** (`Mobile / Chart - Long-press Scrub`): after a 250 ms hold, all bars dim to 50 % opacity, a vertical accent-tertiary line tracks the finger, and a small tooltip floats above the contact point. Lifting the finger returns the chart to the resting state.
- **Legend toggle** (`Mobile / Chart - Legend Toggle`): each legend chip is a 32 px-tall pill with a strikethrough text style when the series is hidden. The footer copy clarifies which series is currently hidden.
- **Pagination** (`Mobile / Chart - Paginated Dense Series`): chosen over pinch-to-zoom for predictability; previous/next controls are 44 × 44 hit targets, dots indicate page count and current position.
- **Hit-target compliance**: every interactive element is ≥ 32 px (legend chips, dismiss button) or ≥ 44 px (pager controls), keeping inside Apple HIG / Material guidance for touch.
- **No hover dependency**: every action that desktop exposes via hover (tooltip, legend highlight) has an equivalent tap or long-press equivalent — see footer hint copy on each card.

## Acceptance criteria

- [x] Tooltip, scrub, and legend-toggle states are designed for mobile and tablet chart cards.
- [x] Touch targets meet hit-target requirements.
- [x] No reliance on hover for any meaningful chart interaction.
