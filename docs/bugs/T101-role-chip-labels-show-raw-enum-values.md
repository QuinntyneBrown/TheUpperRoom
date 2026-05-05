# T101: Role chip editor shows raw enum values instead of display labels

**Status:** Fixed

## Description

The `ur-role-chip-editor` component renders raw enum values as button labels:

| Enum value | Expected label |
|---|---|
| `PrayerLead` | `Prayer Lead` |
| `EventLead` | `Event Lead` |
| `CommunicationLead` | `Communication Lead` |

Design reference: `docs/ui-design.pen` → Desktop / Team → role cards: "Prayer Lead", "Event Lead", "Communication Lead"

## Affected Files

- `frontend/projects/feature-team/src/lib/role-chip-editor/role-chip-editor.html` — renders `{{ role }}` directly
- `frontend/projects/feature-team/src/lib/role-chip-editor/role-chip-editor.ts` — needs a label map

## Fixed

Added `ROLE_LABELS` map to component and used `roleLabel(role)` in template.
