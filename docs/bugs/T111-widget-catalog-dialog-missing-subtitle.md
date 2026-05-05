# T111 — Widget catalog dialog missing subtitle

**Status:** Fixed

**Route:** `/dashboard` (widget catalog dialog)

**Description:**
The widget catalog dialog header shows only the title "Widget catalog" with no subtitle. The design specifies a subtitle: "Drag a widget onto your dashboard, or click to add it at the next free slot."

**Design reference:** `Dialog / Widget Catalog` → catHeadL → catSub: `Drag a widget onto your dashboard, or click to add it at the next free slot.`

**Steps to reproduce:**
1. Navigate to `/dashboard`
2. Click "+ Add widget"
3. Observe the dialog header

**Expected:** Title "Widget catalog" + subtitle "Drag a widget onto your dashboard, or click to add it at the next free slot."
**Actual:** Title "Widget catalog" only, no subtitle

**Component:** `widget-catalog-dialog.html` line 3
