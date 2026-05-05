# T103: Widget catalog dialog title should be "Widget catalog"

**Status:** Fixed

## Description

The widget catalog dialog heading reads "Add Widget" but the design shows "Widget catalog".

| Element | Design | Implementation |
|---|---|---|
| Dialog heading | `Widget catalog` | `Add Widget` |

Design reference: `docs/ui-design.pen` → Dialog / Widget Catalog → `D0TPg` content: `Widget catalog`

## Affected Files

- `frontend/projects/feature-dashboard/src/lib/widget-catalog-dialog/widget-catalog-dialog.html`
  - Change `<h2>Add Widget</h2>` → `<h2>Widget catalog</h2>`
  - Update `aria-label` to match

## Fixed

Changed heading and aria-label from "Add Widget" to "Widget catalog".
