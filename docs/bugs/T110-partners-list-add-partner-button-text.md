# T110 — Partners list CTA button text should be "+ Add partner"

**Status:** Fixed

**Route:** `/partners`

**Description:**
The primary action button on the Partners list page reads "New partner". The current design specifies the text should be "+ Add partner" (consistent with the "+ Add widget" and other add-new CTAs across the app).

**Design reference:** `Desktop / Partners` → ptop → ptopR → KHUPJ (button) → Xfl4P content: `+ Add partner`

**Steps to reproduce:**
1. Navigate to `/partners`
2. Observe the header CTA button

**Expected:** `+ Add partner`
**Actual:** `New partner`

**Component:** `partner-list-page.ts` line 22
