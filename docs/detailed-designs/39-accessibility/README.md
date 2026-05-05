# 39 - Accessibility

**Traces to:** L2-057, L2-058, L2-059 (L1-015).

This cross-cutting design defines accessibility behavior for every slice.

## Components

- Frontend `components/focus-ring` styles - visible focus indicator with at least 3:1 contrast.
- Frontend `components/dialog` - uses Angular CDK focus trap; focus enters on open and returns to the trigger on close.
- Frontend `components/form-field` - always binds visible label text to input ID and exposes validation errors via `aria-describedby`.
- Frontend `components/toast` and `feature-notifications` - use ARIA live regions for realtime notifications.
- Frontend `a11y.spec.ts` - keyboard traversal and screen-reader metadata smoke tests for each primary route.
- Frontend `contrast.spec.ts` - computes token and representative component contrast.

## Rules

- Every interactive element is keyboard reachable in visual reading order.
- Every button/link/input has an accessible name and correct role.
- Modal dialogs trap focus until closed and restore focus to the trigger.
- Realtime notifications are announced in a polite live region unless destructive/urgent.
- Decorative icons are `aria-hidden`; meaningful icons have labels.
- Form validation messages are programmatically associated with their fields.

## Acceptance Tests

- L2-057 AC1: Tab and Shift+Tab reach every interactive control in logical order with visible focus.
- L2-057 AC2: modals move focus in, trap it, and restore focus on close.
- L2-058 AC1: NVDA/Playwright accessibility snapshots show names and roles for representative controls on every primary route.
- L2-058 AC2: SignalR notification updates an ARIA live region.
- L2-059 AC1/AC2: contrast tests assert text, icons, focus rings, errors, and chart series meet WCAG 2.1 AA.

## Radical Simplicity Notes

- Accessibility defaults live in shared components. Feature slices should not hand-roll labels, focus traps, or live regions.
- Lighthouse is a smoke signal, not the only gate; keyboard and contrast tests are explicit.
