# T61 — Screen reader and live-region annotations

**Phase**: 9 — Accessibility annotations
**Area**: Accessibility
**Requirements**: L1-015, L2-058
**Source**: Screen-Level Missing Inventory — "screen-reader/live-region annotations"

## Goal

Add accessible-name, role, and ARIA live-region annotations to the design so the implementation team has explicit guidance.

## Scope

- Accessible names for icon-only buttons (search, close, more).
- Roles for custom widgets (tablist, listbox, dialog, alert, status).
- Live regions: notification toasts (assertive vs. polite), reconnect banner, mark-all-read snackbar.
- Alt text for decorative vs. meaningful imagery (decorative auth shapes are decorative).
- Form-field labels and described-by associations for inline errors.

## Acceptance criteria

- [ ] Annotations applied to every icon-only button and custom widget in the design system.
- [ ] Live-region politeness chosen and documented for each transient surface.
- [ ] Alt-text intent documented for each image/illustration in the design.
