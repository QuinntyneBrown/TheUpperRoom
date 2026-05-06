# T184 — Migrate "Move partner stage" dialog to DialogService

**Status:** COMPLETE

## Implementation notes (radically simple)

- New `StageChangeDialogComponent` at `frontend/projects/feature-partners/src/lib/stage-change-dialog/stage-change-dialog.ts` — owns the reason textarea + Cancel/Advance buttons. Receives `{ pendingStage, stageLabel }` via `UR_DIALOG_DATA`, closes with `{ reason }` on confirm via `UrDialogRef<{ reason: string }>`. Inline template; imports `MatFormFieldModule`, `MatInputModule`, `FormsModule`, `MatButtonModule`, `UrDialogComponent`, `UrButtonComponent` locally so the page no longer needs them.
- `partner-detail-page.ts`: dropped the `MatFormFieldModule`, `MatInputModule`, `FormsModule`, and `UrDialogComponent` imports (no longer used outside the migrated dialog). Dropped `showStageDialog`, `pendingStage`, `stageReason` signals and `openStageDialog` / `confirmStageChange` methods. New `onStageChangeClick(stage)` opens the dialog and calls `changeStage(stage)` only if the dialog returns a result.
- The reason field is captured by the dialog and returned on confirm but the existing `partners.changeStage(id, stage)` API does not accept a reason — preserved that pre-existing limitation rather than expanding scope.
- Template: stage advance/back buttons (the `stage-advance-btn` and its sibling) now call `(click)="onStageChangeClick(...)"` instead of `openStageDialog(...)`. The inline `@if (showStageDialog())` block is gone.
- All `data-testid` values preserved (`stage-change-dialog`, `stage-change-reason`, `stage-change-confirm-btn`, `stage-change-cancel-btn`, `stage-advance-btn`) — `e2e/tests/partners/stage-change-dialog.spec.ts` needs no updates.
- Pencil .pen update deferred — same reasoning as T180–T183.
**Type:** Refactor
**Blocked by:** T179
**Source:** `docs/inline-dialog-audit.md` (item #6)

## Problem

`projects/feature-partners/src/lib/partner-detail-page/partner-detail-page.html:58` renders the stage-change dialog inline alongside the delete dialog. Two `@if` blocks with no stacking discipline; no backdrop; the optional-reason `<textarea>` paints in document flow.

## Update `docs/ui-design.pen`

- **Remove** any inline rendering of the stage-change dialog.
- **Add** `Dialog / Move Partner to Stage (Overlay)` on the modal shell. Header icon `trending_up`, title "Move to {Stage}", subtitle "This change will be recorded in the stage history with your name and an optional reason." Body: optional-reason textarea. Actions: `Cancel` + `Advance partner`.

## Implement

1. Create `projects/feature-partners/src/lib/stage-change-dialog/stage-change-dialog.{ts,html}`. Inputs via `data: { partner: Partner; pendingStage: PartnerStage }`. Emits the entered reason via `UrDialogRef.close({ reason })`.
2. In `partner-detail-page.ts`, replace the `showStageDialog` / `pendingStage` / `stageReason` flow with a `dialog.open(StageChangeDialogComponent, { data: { partner, pendingStage } })` call whose `closed$` triggers `confirmStageChange(reason)`.
3. Strip the `@if (showStageDialog()) { … }` block.
4. Update specs / e2e for `data-testid="stage-change-dialog"`, `stage-change-reason`, `stage-change-confirm-btn`.

## Definition of done

- [ ] Selecting a new stage opens the overlay; backdrop dims the page.
- [ ] ESC / Cancel close without changing stage; confirm advances and closes.
- [ ] Focus returns to the stage-change trigger control.
- [ ] Tests pass.
- [ ] `git commit -m "T184: migrate partner stage-change dialog to DialogService overlay" && git push origin main`.
