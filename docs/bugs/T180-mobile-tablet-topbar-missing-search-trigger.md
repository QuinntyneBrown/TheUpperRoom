# T180 — Mobile/tablet topbar missing global search trigger

**Status:** Fixed ✓

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

## Fix applied

In `frontend/projects/app-shell/src/app/app.html`, added `<ur-global-search-overlay />` inside the topbar, immediately before `<ur-notification-center />`. Order is now: hamburger (tablet) + brand + spacer + **search** + bell + profile.

In `frontend/projects/app-shell/src/app/app.scss`:
- Extended the topbar host alignment rule to include `ur-global-search-overlay` (same `inline-flex` + `align-items: center` pattern as `ur-notification-center` from T179).
- Added missing modal-positioning CSS for the search overlay (`position: fixed; inset: 0; …`), backdrop, panel, and input. The component itself shipped with no positioning CSS, so the overlay used to render inline below the trigger and push the toolbar baseline. With `::ng-deep` (required to bypass `feature-search`'s view encapsulation), the overlay now floats as a centered modal at top of viewport regardless of trigger location.

## Verified

- Tablet (768): search trigger visible in topbar; click opens centered modal with backdrop, search input prominent.
- Existing desktop sidebar-footer trigger continues to work; it now also produces a proper modal instead of an inline overlay.
