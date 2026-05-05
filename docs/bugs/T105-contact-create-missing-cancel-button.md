# T105 — Contact Create page missing Cancel button

**Status:** Fixed

**Route:** `/contacts/new`

**Description:**
The Create Contact form has no Cancel button. The design shows a footer with "Cancel" (navigates back to contacts list) and "Save contact" buttons side by side.

**Design reference:** `Dialog / New Contact` → foot → Cancel button

**Steps to reproduce:**
1. Navigate to `/contacts/new`
2. Observe the form footer — only a submit button is present, no Cancel

**Expected:** A "Cancel" button (or link) that navigates back to `/contacts`
**Actual:** No Cancel button present

**Component:** `contact-form.html` — no cancel button in form footer
