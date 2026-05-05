# T109 — Partner detail stage card hint text wrong

**Status:** Fixed

**Route:** `/partners/:id`

**Description:**
The stage card hint text says "Stage changes are recorded in stage history with the actor and timestamp." The design specifies the text should end with "with the actor and an optional reason."

**Design reference:** `Desktop / Partner Detail - Stage Stepper` → stageCard → hint → text

**Steps to reproduce:**
1. Navigate to `/partners/:id`
2. Observe the hint text below the stage action buttons

**Expected:** `Stage changes are recorded in stage history with the actor and an optional reason.`
**Actual:** `Stage changes are recorded in stage history with the actor and timestamp.`

**Component:** `partner-detail-page.html` line 130
