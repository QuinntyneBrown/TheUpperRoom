# 72 — Keyboard Focus and Dialog Trap Baseline

**Traces to:** L2-057. L1-015.

Vertical slice: a visible focus ring on every focusable element, logical tab order on every page, and a shared focus trap for modal dialogs.

## Components

- Frontend `app-shell/styles/focus.scss` — `:focus-visible { outline: 2px solid var(--focus-ring); outline-offset: 2px; }`. Removes the default browser outline only when a custom one replaces it.
- Frontend `components/dialog/dialog.component` — wraps Material's `MatDialog`; on open, calls `cdkTrapFocus` and stores `document.activeElement`; on close, returns focus to the stored element.
- Smoke test `tests/a11y/tab-order.spec.ts` — for each primary route, presses Tab repeatedly and asserts the visible focus ring lands on each control in DOM order.

## Acceptance tests (L2-057)

- Every interactive element on every primary route shows a visible focus ring on Tab.
- Opening any dialog traps focus inside; Esc closes it and returns focus to the trigger.
- Tab order matches reading order on every primary route.

## Radical simplicity notes

- One CSS rule, one wrapper component, one Playwright test.
- We rely on Angular CDK's `cdkTrapFocus` rather than writing a trap from scratch.
