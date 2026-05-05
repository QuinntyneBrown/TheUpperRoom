# T131 — Hackathon create form: all form field CSS missing

**Status**: Fixed

## Description

The `/hackathons/new` page uses `HackathonCreatePageComponent` with a `ur-dialog` wrapper. The template uses CSS class names for form layout — `.hackathon-form`, `.hackathon-form__field`, `.hackathon-form__row`, `.hackathon-form__label`, `.hackathon-form__partner-opt`, `.hackathon-form__error`, `.hackathon-form__actions` — but none of these classes are defined in the component's `styles` array.

Result: labels and inputs render flush with no spacing, date fields are not side-by-side, error messages are unstyled, and the action buttons have no layout.

## Missing classes

- `.hackathon-form` — outer form layout
- `.hackathon-form__field` — label + input column layout with gap
- `.hackathon-form__row` — side-by-side fields (start/end date)
- `.hackathon-form__label` — partners section label styling
- `.hackathon-form__partner-opt` — partner checkbox row
- `.hackathon-form__error` — field-level error text (red)
- `.hackathon-form__actions` — button row (flex, end-aligned)

## Fix

Add missing CSS to `hackathon-create-page.ts` `styles` array.

## References

- Route: `/hackathons/new`
- Component: `frontend/projects/feature-hackathons/src/lib/hackathon-create-page/hackathon-create-page.ts`
