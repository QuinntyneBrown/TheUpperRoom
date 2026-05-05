# T162 — Create partner form: unstyled inputs, no layout CSS

**Status:** Fixed ✓

## Description

The create partner form (`/partners/new`) renders with bare browser-native inputs and no component styles. The `.partner-form`, `.partner-form__field`, `.partner-form__label`, `.partner-form__stage-opts`, `.partner-form__stage-opt`, and `.partner-form__actions` classes are used in the template but no CSS is defined for them in the component.

## Design (ui-design.pen)

Frame: `Tablet / New Partner Modal` (SmzaX) — inputs use `ur-input` component ref `kTdXr`, same styled inputs as partner edit form.

## Current Behaviour

- All form inputs render with white browser-default backgrounds on the dark surface.
- Fields have no labels styled, no spacing/gap between fields.
- Stage selector buttons have no visual distinction between selected and unselected.

## Expected Behaviour

- Inputs use `UrInputComponent` with dark background, subtle border, accent focus ring.
- Label text uses `$fg-secondary` colour.
- Fields stacked with `gap: $sp-4`.
- Selected stage button is visually distinct.

## Failing Tests

`frontend/e2e/tests/partners/partner-create-form.spec.ts`
