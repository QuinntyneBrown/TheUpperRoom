# T133 — Widget catalog dialog: missing CSS for all widget-catalog-dialog__* classes

**Status**: Fixed

## Description

The `widget-catalog-dialog` component has no `styles` array. The template references `.widget-catalog-dialog__*` CSS classes but none are defined, so:

- Widget name (`__label`) and description (`__desc`) are both `<span>` elements rendered inline — they concatenate visually: "KPIShow a single key metric at a glance."
- The `<ul>` shows browser-default bullet-list styling (bullets, padding-left)
- No card or row styling on each widget entry (`__entry`)
- No visual hierarchy separating header, list, and list items

## Evidence

- Screenshot shows bare bullet-list with mashed-together name+description text
- `widget-catalog-dialog.ts` has no `styles` property
- Template uses: `__header`, `__subtitle`, `__list`, `__entry`, `__info`, `__label`, `__desc` — none defined

## Fix

Add `styles` array to `WidgetCatalogDialogComponent` with CSS for all `.widget-catalog-dialog__*` classes:
- `__list`: reset bullets, padding, margin
- `__entry`: flex row, space-between, border-bottom, padding
- `__info`: flex column so label and desc stack vertically
- `__label`: bold, primary text color
- `__desc`: muted text color, smaller font

## References

- Route: `/dashboard` → click "+ Add widget"
- Component: `frontend/projects/feature-dashboard/src/lib/widget-catalog-dialog/widget-catalog-dialog.ts`
