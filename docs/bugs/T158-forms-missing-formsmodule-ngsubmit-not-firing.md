# T158 — Forms: missing FormsModule import causes (ngSubmit) to never fire

**Status**: Fixed

## Description

Multiple form components used `(ngSubmit)="submit()"` on `<form>` elements but did not import `FormsModule`. In Angular standalone components, `(ngSubmit)` is emitted by `NgForm` (from `FormsModule`). Without the import, the event binding is inert — clicking the submit button or pressing Enter never calls `submit()`.

**Affected components:**
- `feature-auth/sign-in-page` — login always failed silently
- `feature-auth/recover-page`
- `feature-auth/register-page`
- `feature-auth/reset-page`
- `feature-contacts/contact-form`
- `feature-contacts/new-contact-dialog`
- `feature-partners/partner-edit-page`

## Fix

Added `FormsModule` to the `imports` array of each affected standalone component.

## References

- Root cause: `(ngSubmit)` requires `NgForm` which is provided by `FormsModule`
