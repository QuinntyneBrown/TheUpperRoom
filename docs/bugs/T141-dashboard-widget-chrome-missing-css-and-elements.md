# T141 — Dashboard widget chrome missing accent-soft header, drag handle, and resize hint

**Status**: Fixed ✓

## Description

Each dashboard widget card is missing key design elements from the widget chrome (the editable header/footer):

- Widget header has no `$accent-soft` background — renders transparent instead
- No `drag_indicator` icon on the left of the header (design: `grip-vertical` lucide icon)
- Widget type label shows raw type string with `text-transform: uppercase` (e.g. "LINECHART") instead of a formatted label (e.g. "Line Chart") from the widget catalog
- No resize hint icon (`open_in_full`) pinned to the bottom-right of each widget

## Fix

Update `dashboard-page.ts`:
- Add `background: var(--ur-accent-soft)` to `.dashboard-widget__header`
- Add `drag_indicator` mat-icon as drag handle on left of header
- Look up label from `WIDGET_CATALOG` in a `widgetLabel()` method
- Add `.dashboard-widget__resize-hint` with `open_in_full` icon at bottom-right

## References

- Component: `frontend/projects/feature-dashboard/src/lib/dashboard-page/dashboard-page.ts`
- Template: `frontend/projects/feature-dashboard/src/lib/dashboard-page/dashboard-page.html`
