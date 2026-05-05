# T140 — Partner contacts panel: missing CSS for header, form inputs, and row layout

**Status**: Fixed ✓

## Description

`PartnerContactsPanelComponent` styles only define `.contacts-remove-error` and `.partner-contacts__empty`. The template uses many additional classes with no rules:

- `.partner-contacts__hd` — header row, no flex layout (label and "+ Associate" button not spaced apart)
- `.partner-contacts__label` — "CONTACTS" label, no font/color styling
- `.partner-contacts__new-form` — new contact form container, no padding
- `.partner-contacts__new-banner` — "Will be created and linked atomically." banner, no styling
- `.partner-contacts__new-row` — first/last name input row, no flex/gap layout
- `.partner-contacts__new-actions` — Cancel/Create buttons row, no flex/gap
- Form inputs — white browser-default background (dark theme missing)
- `.partner-contacts__row` — each contact row, no flex layout
- `.partner-contacts__avatar` — initials circle, no size/background
- `.partner-contacts__body` — name/email, no flex column
- `.partner-contacts__name` — link, no color styling
- `.partner-contacts__email` — email text, no font/color

## Fix

Add missing CSS classes to `PartnerContactsPanelComponent` styles array.

## References

- Route: `/partners/:id`
- Component: `frontend/projects/feature-partners/src/lib/partner-contacts-panel/partner-contacts-panel.ts`
