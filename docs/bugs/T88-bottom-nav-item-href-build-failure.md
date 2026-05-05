# T88: Build failure — ur-bottom-nav-item missing href input in compiled dist

**Status:** Open

## Description

The `app-shell` Angular build fails with:

```
NG8002: Can't bind to 'href' since it isn't a known property of 'ur-bottom-nav-item'.
```

The source at `projects/components/src/lib/bottom-nav-item/bottom-nav-item.ts` was updated to add an `href: string` input (replacing the old `active`/`selected` event-based API), but the compiled library at `dist/components/` was never rebuilt and still exports the old API.

`app.html:104` binds `[href]="item.route"` against the stale compiled type.

## Root Cause

`dist/components/fesm2022/components.mjs` exposes `UrBottomNavItemComponent` with inputs `icon | label | active | disabled` and output `selected`. The updated source has `icon | label | href | disabled` with RouterLink.

The `dist/` was not rebuilt after the source change.

## Fix

Rebuild the components library:

```
cd frontend && ng build components
```

Then verify the app-shell build succeeds:

```
ng build app-shell --configuration=development
```

## Fixed

Rebuilt components library (`ng build components`) — dist now exposes the updated `UrBottomNavItemComponent` with `href` input and anchor rendering. Unit test added in `bottom-nav-item.spec.ts`. `ng build app-shell --configuration=development` succeeds.
