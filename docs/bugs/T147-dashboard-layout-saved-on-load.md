# T147 — Dashboard shows "Layout saved" toast on initial page load

**Status**: Fixed ✓

## Description

When navigating to `/dashboard` with an existing saved layout, a "Layout saved" toast appears immediately without any user action. The user hasn't dragged or resized anything.

Root cause: `ngOnInit` subscribes to `save$` before `loadLayout()` completes. When `this.items.set(layout.items)` fires, gridster renders widgets and triggers `itemChangeCallback` for each item, which emits `save$.next()`. After the 300ms debounce, `persist()` is called and the toast fires.

## Fix

Delay the `save$` subscription by one tick (`setTimeout(..., 0)`). This ensures any gridster initialization callbacks emitted during the current tick are not received by the subscription.

## References

- Component: `frontend/projects/feature-dashboard/src/lib/dashboard-page/dashboard-page.ts`
