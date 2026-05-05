# T116 — Contact Create form shows Notes field not in design

**Status**: Open

## Description

The "New contact" form (`/contacts/new`) renders a Notes textarea by default.
The design for "Dialog / New Contact" does not include a Notes field — notes are added post-creation from the contact detail page.

**Current:** First name, Last name, Email, Phone, City, **Notes**, Cancel, Save contact
**Design:** First name, Last name, Email, Phone, City, Partner (optional), Cancel, Save contact

## Steps to reproduce

1. Navigate to `/contacts/new`
2. Observe the Notes textarea below City

## Fix

Pass `[showNotes]="false"` to `<ur-contact-form>` in `contact-create-page.html`.

## References
- Design: `Dialog / New Contact - Empty (Submit Disabled)` — `h69wq` form fields: no notes field
