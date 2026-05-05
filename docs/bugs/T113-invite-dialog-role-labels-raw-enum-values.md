# T113 — Invite dialog role checkboxes show raw enum values

**Status:** Fixed

**Route:** `/team` (invite dialog)

**Description:**
The invite dialog role checkboxes show raw enum values (`CityLead`, `PrayerLead`, `EventLead`, `CommunicationLead`) instead of human-readable labels (`City Lead`, `Prayer Lead`, `Event Lead`, `Communication Lead`).

**Design reference:** Flow 32 — Invite Member: roles listed as "City Lead", "Prayer Lead", "Event Lead", "Communication Lead"

**Steps to reproduce:**
1. Navigate to `/team`
2. Click "+ Invite member"
3. Observe the role checkboxes

**Expected:** `City Lead`, `Prayer Lead`, `Event Lead`, `Communication Lead`
**Actual:** `CityLead`, `PrayerLead`, `EventLead`, `CommunicationLead`

**Component:** `invite-dialog.html` line 30 — uses `{{ role }}` directly instead of a label map

**Note:** Same issue as T101 which was fixed only in `role-chip-editor` but not the invite dialog.
