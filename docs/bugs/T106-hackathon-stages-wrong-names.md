# T106 — Hackathon stage selector shows wrong stage names

**Status:** Fixed

**Route:** `/hackathons/:id`

**Description:**
The hackathon detail page shows 5 stage buttons: Discover | Define | Design | Develop | Launch.
The design specifies the 4 D's: **Discover → Design → Develop → Deploy** (4 stages).
"Define" should not exist. "Launch" should be "Deploy".

**Design reference:** `Desktop / Hackathons` → hcontent → d1/d2/d3/d4

**Steps to reproduce:**
1. Navigate to `/hackathons/:id`
2. Observe the stage selector buttons

**Expected:** 4 buttons — Discover | Design | Develop | Deploy
**Actual:** 5 buttons — Discover | Define | Design | Develop | Launch

**Component:** `hackathon-detail-page.ts` → `STAGES` constant; `api/hackathon.service.ts` → `HackathonStage` type
