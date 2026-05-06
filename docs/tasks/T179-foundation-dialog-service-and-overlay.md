# T179 — Foundation: introduce DialogService and overlay-backed `<ur-dialog>`

**Status:** ACCEPTED
**Type:** Refactor (foundation — blocks T180–T190)
**Source:** `docs/inline-dialog-audit.md`

## Why

Per `docs/inline-dialog-audit.md`, every dialog in the app today is rendered **inline** by a `@if (signal()) { <ur-dialog>…</ur-dialog> }` block in the host template. There is no `MatDialog`, no `CdkDialog`, no `DialogService`. The `<ur-dialog>` component itself sets `role="dialog"` / `aria-modal="true"` but has no fixed positioning, no backdrop, no portaling, and no focus return — it paints in document flow inside whatever ancestor's stacking/clipping context it lands in.

This task introduces the missing infrastructure that every subsequent task (T180–T190) depends on.

## Scope

1. **Add a `DialogService`** in `projects/components/src/lib/dialog/dialog.service.ts` that wraps Angular CDK's `Dialog` (`@angular/cdk/dialog`) — chosen over `MatDialog` to avoid a heavier Material dependency. The service exposes:

   ```ts
   open<T, R = unknown>(component: ComponentType<T>, config?: UrDialogConfig<T>): UrDialogRef<R>;
   ```

   - Always supplies a backdrop (`.ur-dialog-backdrop`) styled with `var(--ur-bg-scrim, rgba(10,10,15,0.7))`.
   - Sets `hasBackdrop: true`, `disableClose: false` by default; `closeOnNavigation: true`.
   - Centers the panel; max-width `min(640px, calc(100vw - 32px))`; max-height `calc(100vh - 64px)` with internal scroll.
   - Sets `aria-modal` and applies `inert` to `<main>` background so AT cannot reach behind the dialog.
   - Returns focus to the trigger element on close.
   - Exposes a `closed$: Observable<R | undefined>` and `close(result?: R)`.

2. **Update `<ur-dialog>` (`projects/components/src/lib/dialog/dialog.{ts,html,scss}`)** so it is the *content* of a CDK dialog, not a self-styled card. It should:
   - Drop the `cdkTrapFocus` / `cdkTrapFocusAutoCapture` attributes (the CDK dialog overlay handles trapping).
   - Drop the inline `(keydown.escape)` handler (CDK dialog handles ESC via `disableClose`).
   - Continue to render the title / subtitle / icon / close button / actions slots exactly as today, but with a fixed max-width that matches the panel.
   - Stop setting `role="dialog"` / `aria-modal="true"` on its own element — those go on the CDK panel.

3. **Register the service** via `provideDialog()` (CDK) in `app.config.ts`. Add CSS for `.ur-dialog-backdrop` and `.cdk-overlay-pane.ur-dialog-pane` in `projects/components/src/lib/styles/_dialog-overlay.scss`, imported once from `app.scss`.

4. **Add a `--ur-bg-scrim` token** in `projects/app-shell/src/styles/tokens.scss` and `projects/components/src/lib/styles/_tokens.scss` (default `rgba(10, 10, 15, 0.7)` to match the existing hand-rolled overlay in `contacts-list-page`).

## Update `docs/ui-design.pen`

Use the Pencil MCP server (`open_document` → `batch_get` → `batch_design`).

- **Add** a reusable component frame `Dialog / Modal Shell (Overlay)` showing: full-viewport scrim, centered panel (max-width 640), header (icon slot, title, subtitle, close X), content slot, actions slot. This is the canonical look every dialog migrated in T180–T190 will conform to.
- **Add** a token swatch frame for `--ur-bg-scrim` if a tokens page exists.
- Do **not** delete any existing dialog frames in this task — T180–T190 each remove their own inline frame and add their overlay-anchored variant.

## Implement

- Wire up the DialogService and overlay-aware `<ur-dialog>` per "Scope" above.
- Add a unit spec in `projects/components/src/lib/dialog/dialog.service.spec.ts` covering: backdrop renders, ESC closes, click-outside closes, focus returns to trigger, `inert` is applied/removed on main.
- Update `app-shell/src/app/test/dialog-test.ts` to use `DialogService.open` so it acts as a live integration smoke test.
- Run: `npm run build components && npm test -- --include='**/dialog*.spec.ts'`.

## Definition of done

- [ ] `DialogService` exported from `projects/components/src/public-api.ts`.
- [ ] `<ur-dialog>` no longer self-traps focus or handles ESC; passes its existing tests.
- [ ] No call sites changed yet — they continue to render inline (broken visually is acceptable for one commit; T180+ fix each one).
- [ ] `dialog-test.ts` opens via `DialogService` and the e2e for the test harness still passes.
- [ ] Pencil doc has a `Dialog / Modal Shell (Overlay)` frame.
- [ ] `git add -A && git commit -m "T179: foundation — DialogService and overlay-backed ur-dialog" && git push origin main`.

## Out of scope

- Migrating any feature dialog (handled by T180–T190).
- Removing `<div class="contacts-list-page__overlay">` (handled by T190).
- Changes to `<ur-widget-catalog-dialog>` (handled by T189).
