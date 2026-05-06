# T180 — Mobile/tablet topbar missing global search trigger

**Status:** Open

## Description

On viewports below 1280px the app shell renders a topbar with: hamburger (tablet only) + brand icon + brand text + spacer + bell + profile. The **search trigger is absent** from this topbar.

The global search trigger (`<ur-global-search-overlay>`) is rendered only in the desktop sidebar footer (`.shell__sidenav-footer`). At Mobile (375) and Tablet (768) the user has no visible affordance to open global search — only the keyboard shortcut Cmd/Ctrl-K.

Per `docs/ui-design.pen`:
- `w04I0S` (Mobile Dashboard) right group: `[search-icon, bell-with-dot, avatar]`
- `UumcQ` (Tablet Dashboard) right group: `[search-bar 280w (Component/Search), bell, avatar]`

## Reproduction

1. Login at `http://localhost:4200`.
2. Resize to 768 (or 375).
3. Inspect the topbar — only bell + profile, no search.

## Expected behaviour

A search trigger lives in the topbar between the brand area and the notification bell, opening the same global-search-overlay panel as the desktop trigger. (Polishing the mobile/tablet trigger to a full search bar vs. icon is a follow-up; the missing trigger itself is the immediate bug.)

## Proposed fix

Render `<ur-global-search-overlay />` inside the topbar, before the notification-center, mirroring the order used in the desktop sidebar footer. The component is already imported by `App` and exposes its own trigger button — no new code required.
