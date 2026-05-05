# 53 — App Shell Responsive Navigation

**Traces to:** L2-039, L2-040, L2-041. L1-009.

Vertical slice: the app-wide shell layout — persistent sidebar on `lg+`, hamburger drawer on `sm/md`, bottom navigation bar on `xs`.

## Status
Accepted

## Design update (2026-05-05)
Design exports (`design-exports/`) show three distinct patterns (differs from original README):

| Viewport | Pattern |
|---|---|
| xs `< 768 px` | Top bar (logo + team name; notification bell + avatar initials) + **bottom nav** (Home, Partners, Hacks, More) |
| sm/md `768 – 1279 px` | Top bar (hamburger + logo + title + search + notifications + avatar) + overlay `mat-sidenav` drawer |
| lg+ `≥ 1280 px` | Persistent `mat-sidenav mode="side"` (WORKSPACE + GLOBAL sections, 220 px) + content area |

No separate `ViewportService` needed — `BreakpointObserver` is used directly in the shell component.

## Components

- `app-shell/src/app/app.ts` (the root `App` component becomes the shell; health check stays here).
- `BreakpointObserver` from `@angular/cdk/layout` drives two signals: `isDesktop` (≥1280) and `isMobile` (<768).
- `computed` derives `sidenavMode` and `sidenavOpened` from those signals.
- Nav items declared as plain arrays (`WORKSPACE_ITEMS`, `GLOBAL_ITEMS`, `BOTTOM_NAV_ITEMS`).

## Acceptance tests

- L2-039: Playwright at 375×667 — `[data-testid="bottom-nav"]` visible; no horizontal scroll.
- L2-040: Playwright at 768×1024 — `[data-testid="hamburger"]` visible; `[data-testid="bottom-nav"]` absent.
- L2-041: Playwright at 1280×800 — `[data-testid="side-nav"]` visible; `[data-testid="hamburger"]` absent.

## Radical simplicity notes

- One component file, one template, signals control visibility.
- `window.matchMedia` initial value avoids flash on load.
- Nav item arrays are module-level constants (zero DI overhead).
