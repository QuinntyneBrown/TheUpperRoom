# T100: Partner list and board — "In Funnel" should be "In funnel"

**Status:** Fixed

## Description

The `InFunnel` stage label is inconsistent across the feature-partners library:

| File | Label used |
|---|---|
| `partner-list-page.ts` | `In Funnel` (wrong) |
| `partners-board-page.ts` | `In Funnel` (wrong) |
| `partner-detail-page.ts` | `In funnel` (correct) |
| `partner-create-page.ts` | `In funnel` (correct) |

## Affected Files

- `frontend/projects/feature-partners/src/lib/partner-list-page/partner-list-page.ts` line 11
- `frontend/projects/feature-partners/src/lib/partners-board-page/partners-board-page.ts` line 10

## Fixed

Changed `In Funnel` → `In funnel` in both files.
