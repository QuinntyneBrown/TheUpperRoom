# 73 — Accessible Names, Form Errors, and Live Regions

**Traces to:** L2-058. L1-015.

Vertical slice: shared form components produce screen-reader-correct labels and error wiring; a single live region announces realtime notifications.

## Components

- Frontend `components/form-field` — wraps Material's form field. Always renders a visible `<label>` linked by `for`/`id`. Error messages render in a `<div id="{id}-err" role="alert">` and the input has `aria-describedby="{id}-err"` only when an error is present.
- Frontend `components/icon-button` — requires a non-empty `[ariaLabel]` input or fails build (Angular template type-check rule). Decorative `<svg>` icons are `aria-hidden="true"`.
- Frontend `components/live-region` — single `<div aria-live="polite" aria-atomic="true">` mounted once at the shell level. `notification.service` writes its current message into this region for 3 s.
- Tests `tests/a11y/snapshot.spec.ts` — runs `axe-core` on every primary route; fails on any "serious" or "critical" violation.

## Acceptance tests (L2-058)

- Every form input has a programmatic label and, when invalid, an `aria-describedby` pointing to the error.
- Every icon-only button has an accessible name.
- Realtime notifications are announced by the screen reader; non-meaningful UI changes are not.
- `axe-core` snapshot is clean on every primary route.

## Radical simplicity notes

- One live region for the whole app. No per-feature politeness levels.
- Decorative vs meaningful icons is a binary input on the icon component.
