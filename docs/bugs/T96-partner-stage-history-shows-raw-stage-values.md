# T96: Partner stage history shows raw API stage values instead of display labels

**Status:** Fixed

## Description

The stage history timeline on Partner Detail shows raw API stage names ("InFunnel") instead of human-readable labels ("In funnel").

| Element | Design | Implementation |
|---|---|---|
| History fromStage | "In Funnel" | "InFunnel" |
| History toStage | "In Funnel" | "InFunnel" |

Design reference: `docs/ui-design.pen` → "Desktop / Partner Detail - Stage History" (`wvjZP`) → timeline entries show "In Funnel" (display label), never raw enum values.

## Affected Files

- `frontend/projects/feature-partners/src/lib/partner-detail-page/partner-detail-page.html`
  - Replace `{{ entry.fromStage }}` with `{{ stageLabel(entry.fromStage) }}`
  - Replace `{{ entry.toStage }}` with `{{ stageLabel(entry.toStage) }}`
- `frontend/projects/feature-partners/src/lib/partner-detail-page/partner-detail-page.ts`
  - Add `stageLabel(stage: PartnerStage): string` method

## Fixed

- Added `stageLabel()` method that maps `PartnerStage` values to display labels via the existing STAGES array
- Updated history template to use `stageLabel()` for both `fromStage` and `toStage`
