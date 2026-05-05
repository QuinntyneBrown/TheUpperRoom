# T107 — Dashboard header "Add widget" button should be "+ Add widget"

**Status:** Fixed

**Route:** `/dashboard`

**Description:**
The "Add widget" button in the dashboard header shows "Add widget" (with a mat-icon). The design specifies the button text should be "+ Add widget" (matching the empty-state CTA).

**Design reference:** `Desktop / Dashboard - Empty` → htop → addBtn → "+ Add widget"

**Steps to reproduce:**
1. Navigate to `/dashboard`
2. Observe the button in the page header (top-right of content area)

**Expected:** `+ Add widget`
**Actual:** icon + `Add widget`

**Component:** `dashboard-page.html` line 4-6
