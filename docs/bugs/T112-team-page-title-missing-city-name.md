# T112 — Team page title missing city name

**Status:** Open

**Route:** `/team`

**Description:**
The team page heading shows "Team" without the city name. The design specifies the heading should be "Team · [City]" (e.g., "Team · Toronto").

**Design reference:** `Desktop / Team` → tmain → ttop → xYbAG content: `Team · Toronto`

**Steps to reproduce:**
1. Navigate to `/team`
2. Observe the page heading

**Expected:** `Team · Toronto` (with the user's city)
**Actual:** `Team`

**Note:** Requires backend `GET /api/teams/local` to return team/city name in the response, or the `/api/auth/me` response to include `city`. Currently neither provides city data.

**Component:** `local-team-page.html` line 3
