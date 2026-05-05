# 53 — App Shell Responsive Navigation

**Traces to:** L2-039, L2-040, L2-041. L1-009.

Vertical slice: the app-wide shell layout — side nav on `lg+`, hamburger drawer on `<sm`, compact top nav on `sm/md`. No-horizontal-scroll smoke test on every authenticated route.

## Components

- Frontend `app-shell/shell.component` — three layout templates switched by `viewport$`:
  - `xs`: top bar with hamburger; nav items in a `<mat-sidenav mode="over">` drawer.
  - `sm/md`: top bar with horizontal nav links.
  - `lg/xl`: persistent left `<mat-sidenav mode="side">` plus content area.
- Frontend `app-shell/viewport.service` — observes `window.matchMedia` for the breakpoint set in slice 56 and emits `xs|sm|md|lg|xl`.
- Frontend `<router-outlet>` is wrapped in a content container with `overflow-x: hidden` and `max-width: 1440px` on `xl`.

## Acceptance tests

- L2-039: Playwright at `375x667` visits every authenticated route → asserts hamburger is visible, side drawer is closed by default, page has no horizontal scroll.
- L2-040: at `768x1024`, asserts horizontal top nav, no sidebar.
- L2-041: at `1280x800`, asserts persistent side nav and content max-width ≤ 1440 px.

## Radical simplicity notes

- One component, three templates. No layout builder, no template registry.
- `matchMedia` is the source of truth — no resize listener.
- Each route is responsible only for its own content; the shell guarantees layout primitives.
