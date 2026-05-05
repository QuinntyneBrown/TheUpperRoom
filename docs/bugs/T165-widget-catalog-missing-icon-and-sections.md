# T165 — Widget catalog: items missing icon, section labels, and icon-only add button

**Status:** Fixed ✓

## Description

The widget catalog dialog (`ur-widget-catalog-dialog`) renders each widget type as a plain text row with a stroked "Add" text button. The design (Dialog / Widget Catalog, `O0h0ll`) specifies:
- Each item has a 36×36 `$accent-soft` icon circle on the left
- Section category labels in uppercase monospace (`$fg-muted`, `CHARTS`, `KPI CARDS`, `FEEDS`)
- The action is a `lucide/plus` icon (accent-primary colour), not a text button
- `CatalogEntry` has no `icon` or `section` field

## Design (ui-design.pen)

Frame: `Dialog / Widget Catalog` (`O0h0ll`), body `obn7i`:
- Sections: "CHARTS" / "KPI CARDS" / "FEEDS" — `$font-mono`, `$fs-xs`, `$fg-muted`, `letterSpacing: 1`
- Item (`c1`): `alignItems: center`, `gap: $sp-3`, `padding: $sp-3`, `fill: $bg-surface`, `stroke: $border-subtle`, `cornerRadius: $radius-md`
  - Icon frame: 36×36, `fill: $accent-soft`, `cornerRadius: $radius-md`, centred icon
  - Body: name (600 weight) + description ($fg-secondary)
  - Right: `lucide/plus` icon in `$accent-primary`

## Current Behaviour

- Items render as label + description text + "Add" stroked button (no icon, no category).
- `CatalogEntry` interface has no `icon` or `section`.

## Expected Behaviour

- Each item shows an icon circle, name, description, and a `+` icon button.
- Items grouped under section headers (CHARTS, KPI CARDS, FEEDS).

## Failing Tests

`frontend/e2e/tests/dashboard/widget-catalog-item-icons.spec.ts`
