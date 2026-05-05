# T118 — Partner List: card meta shows raw stage enum value (InFunnel)

**Status**: Open

## Description

The partner list card renders `{{ row.stage }}` directly, which outputs the raw enum value.
Partners with stage `InFunnel` show "InFunnel" instead of "In funnel".

**Current:** `Toronto · InFunnel`
**Expected:** `Toronto · In funnel`

## Steps to reproduce

1. Have a partner with stage `InFunnel`
2. Navigate to `/partners`
3. Observe the card meta text

## Fix

Add a `stageLabel` method to map enum values to display labels.

## References
- `frontend/projects/feature-partners/src/lib/partner-list-page/partner-list-page.ts` — `ALL_STAGES` array
