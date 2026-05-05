# T160 — Partner edit form: unstyled native inputs, no card container, wrong save button text

**Status:** Open

## Description

The partner edit page (`/partners/:id/edit`) has three issues vs `Desktop / Partner Edit - Pristine`:

1. **Bare browser-native inputs** — `<input>` and `<textarea>` render with OS defaults (white background on dark surface). Should use `UrInputComponent` to match the design system.
2. **No card container** — The form has no `$bg-surface` card with padding, border, and `$radius-2xl` corner radius. Fields are rendered directly on the page background.
3. **Save button text is "Save" instead of "Save changes"** — Design shows "Save changes".

## Design (ui-design.pen)

Frame: `Desktop / Partner Edit - Pristine` (node `jS1hx`)

- Form card (`GIsaq`): `$bg-surface`, `$radius-2xl`, `1px $border-subtle`, `padding: $sp-12`, `gap: $sp-6`, `width: 760px`
- Fields use the shared styled input component (`kTdXr` / `Y5QHiy` refs)
- Right button: "Save changes" (`tEGDh`)

## Current Behaviour

Native `<input>` and `<textarea>` elements with browser default styling appear on the page with white backgrounds. No card container. Submit button says "Save".

## Expected Behaviour

Form rendered inside a styled card. Inputs use `UrInputComponent`. Save button reads "Save changes".

## Failing Tests

`frontend/e2e/tests/partners/partner-edit-form.spec.ts`
