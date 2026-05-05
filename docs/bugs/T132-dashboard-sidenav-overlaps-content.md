# T132 — Dashboard page: sidebar overlaps content instead of pushing it

**Status**: Fixed

## Description

On the `/dashboard` page (and potentially any page that loads before the first navigation completes), the `mat-sidenav` in desktop "side" mode overlays the page content instead of pushing it to the right. The "Dashboard" heading and subtitle "Welcome to your workspace" are hidden behind the sidebar — only "ce" (end of "workspace") shows in the visible content area.

**Root cause:** During the `resolving` phase (before the first navigation completes), the `mat-sidenav-container` is hidden via `display: none` (from `.shell--hidden`). Angular Material's `_updateContentMargins()` runs during `ngAfterContentInit()` while the container is hidden. `offsetWidth` of the sidenav returns 0 at that time, so Angular Material sets `marginLeft = 0px`. When `resolving` completes and the container becomes visible, Angular Material does not recalculate the margin (no drawer state changed), leaving `marginLeft = 0px`.

Other pages (partners, contacts, hackathons) happen to work because the timing of Angular Material's recalculation coincides with a re-evaluation of the drawer bindings on those pages, but the dashboard page (which initializes `angular-gridster2`) does not benefit from this incidental fix.

## Evidence

- `mat-sidenav-content` bounding box: `{x:0, width:1440}` (should be `{x:220, width:1220}`)
- `mat-sidenav-content` inline style: null (no `margin-left` applied)
- `.mat-drawer-side` class IS present on the sidenav (correct mode)
- Partners page: `style="margin-left: 220px"` (correct) ✓
- Dashboard page: no style attribute (incorrect) ✗

## Fix

Change `.shell--hidden { display: none; }` to `.shell--hidden { visibility: hidden; }` in `app.scss`.

This keeps the `mat-sidenav-container` in the layout (so `offsetWidth` calculates correctly as 220px) while hiding it visually. The `shell__resolving` overlay (fixed-position, z-index 9999) covers the invisible container during the resolving phase, so users never see blank space.

## References

- Route: `/dashboard`
- Component: `frontend/projects/app-shell/src/app/app.scss`
- Angular Material version: 21.2.x
