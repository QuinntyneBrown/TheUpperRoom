# T104 — Contact Create submit button shows "Create contact" instead of "Save contact"

**Status:** Fixed

**Route:** `/contacts/new`

**Description:**
The submit button on the Create Contact form shows "Create contact". The design specifies the button label should be "Save contact".

**Design reference:** `Dialog / New Contact` → footer → submit button label = "Save contact"

**Steps to reproduce:**
1. Navigate to `/contacts/new`
2. Observe the submit button label

**Expected:** `Save contact`
**Actual:** `Create contact`

**Component:** `contact-create-page.html` — `submitLabel="Create contact"`
