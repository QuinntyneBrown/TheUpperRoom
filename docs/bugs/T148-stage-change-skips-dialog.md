# T148 — Stage advance/revert button skips confirmation dialog

**Status**: Open

## Description

Clicking the "In funnel →" (or "← Lead") stage action button on the partner detail page immediately calls the API instead of opening the confirmation dialog shown in the design.

Expected: a modal dialog appears with the from→to transition, an optional reason field, and Cancel / Advance buttons.

Actual: the API is called directly, resulting in an error toast (since the route is not mocked for the inline use case) or a silent state change without any user confirmation.

Root cause: `changeStage()` in `partner-detail-page.ts` calls `this.partners.changeStage()` directly. The stage action buttons in the template call `changeStage()` on click instead of first opening a confirmation dialog.

## Fix

Add `showStageDialog`, `pendingStage`, and `stageReason` signals to `PartnerDetailPageComponent`. Change the advance/back buttons to call `openStageDialog(stage)`. Add a dialog template (reusing `UrDialogComponent`) with the from→to pill, an optional reason `<textarea>`, and Cancel / Advance partner buttons that call `confirmStageChange()`.

## References

- Component: `frontend/projects/feature-partners/src/lib/partner-detail-page/partner-detail-page.ts`
- Template: `frontend/projects/feature-partners/src/lib/partner-detail-page/partner-detail-page.html`
- Design: `Desktop / Partner Detail - Stage Stepper` → `Dialog / Partner Stage - Advance`
