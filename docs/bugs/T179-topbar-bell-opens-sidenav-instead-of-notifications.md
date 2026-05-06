# T179 — Mobile/tablet topbar bell opens sidenav instead of notifications

**Status:** Open

## Description

On viewports below 1280px, the app shell renders a topbar with a bell icon. Clicking the bell calls `sidenav.open()` (line 79 of `frontend/projects/app-shell/src/app/app.html`):

```html
<button mat-icon-button aria-label="Notifications" (click)="sidenav.open()">
  <mat-icon>notifications</mat-icon>
</button>
```

This opens the **side navigation drawer** rather than the **notification panel**. The `<ur-notification-center>` component (which has its own bell + panel) lives in the sidenav footer, so a user must:

1. Tap the topbar bell → drawer opens.
2. Scroll to the bottom of the drawer.
3. Tap the actual notification-center bell → panel finally opens.

Per `docs/ui-design.pen` (e.g. `w04I0S` Mobile Dashboard right group: bell with notification-dot), the topbar bell should open the notification panel directly. This double-tap pattern doesn't appear anywhere in the design.

## Reproduction

1. Login at `http://localhost:4200`.
2. Resize viewport to 375 (or 768/1024).
3. Click the bell icon in the topbar.
4. Observed: side navigation drawer slides open showing the full nav (Dashboard, Partners, …).
5. Expected: notification panel opens directly with the recent notifications list.

## Expected behaviour

The topbar bell should toggle the notification panel directly, matching the behaviour of `<ur-notification-center>`'s own bell (used on the desktop sidebar footer).

## Proposed fix

Use a template reference variable on `<ur-notification-center>` and have the topbar bell call its `toggle()` (a new public method on `NotificationCenterComponent`). Remove the redundant hand-rolled topbar bell button and render a single `<ur-notification-center>` in the topbar slot for mobile/tablet, keeping the sidenav-footer instance for desktop. This keeps a single source of truth for "current notification state" and matches the `.pen` pattern.
