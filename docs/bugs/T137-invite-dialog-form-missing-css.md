# T137 — Invite dialog: form fields missing CSS (white email input on dark theme)

**Status**: Fixed ✓

## Description

`InviteDialogComponent` has `styles: [...]` but only defines `.invite-save-error`. The template uses several additional CSS classes that have no rules:

- `.invite-form__field` — field container, no flex/gap layout
- Email `<input>` — browser-default white background on dark theme
- `.invite-form__roles` — role checkboxes container, no layout
- `.invite-form__role-opt` — each checkbox+label row, no flex layout
- `.invite-form__actions` — buttons row, no flex/gap/justify
- `.invite-form__error` — error text, no color/size

## Fix

Add missing CSS classes to `InviteDialogComponent` styles array.

## References

- Route: `/team` → click "+ Invite member"
- Component: `frontend/projects/feature-team/src/lib/invite-dialog/invite-dialog.ts`
