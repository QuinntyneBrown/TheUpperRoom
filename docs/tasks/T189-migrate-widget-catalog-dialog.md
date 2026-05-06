# T189 — Migrate widget-catalog dialog to `<ur-dialog>` + DialogService

**Status:** Open
**Type:** Refactor
**Blocked by:** T179
**Source:** `docs/inline-dialog-audit.md` (item #11)

## Problem

`projects/feature-dashboard/src/lib/widget-catalog-dialog/widget-catalog-dialog.ts:6` is a bespoke dialog component (`<ur-widget-catalog-dialog>`) with its own card-like styles and close button — not based on `<ur-dialog>`. It is rendered inline by the dashboard at `dashboard-page.html:11` with no overlay, no backdrop, no fixed positioning. It paints above the gridster in document flow.

This is the only "dialog" in the codebase that doesn't use `<ur-dialog>`, so it has drifted from the standard chrome (header padding, close button, action layout, tokens).

## Update `docs/ui-design.pen`

- **Remove** any inline depiction of the widget catalog (catalog appearing in dashboard flow).
- **Add** `Dialog / Widget Catalog (Overlay)` on the modal shell. Header title "Add a widget", subtitle copy from `T111` if applicable. Body: section-grouped list of widgets (icon + label + description). Each row is a button.
- Reuse the modal-shell tokens — drop the bespoke `--ur-bg-overlay` fallback and `border-radius: 12px` chrome from this component.

## Implement

1. Refactor `WidgetCatalogDialogComponent` so its template is the *content* of `<ur-dialog>` (not its own bespoke card). Remove the inline `:host` styles for header/close — those move to / are inherited from `<ur-dialog>`.
2. Inject `UrDialogRef` and emit selection via `dialogRef.close(item)` instead of the existing `selected` / `closed` outputs.
3. In `dashboard-page.ts`:
   ```ts
   onAddWidget() {
     this.dialog.open(WidgetCatalogDialogComponent, { ariaLabel: 'Add a widget' })
       .closed$.subscribe(item => { if (item) this.onWidgetAdded(item); });
   }
   ```
4. Strip the `@if (showCatalog()) { <ur-widget-catalog-dialog/> }` block and the `showCatalog` signal from `dashboard-page.{ts,html}`.
5. Keep the `W` keyboard shortcut — wire it into `onAddWidget()`.
6. Update spec at `feature-dashboard/src/lib/widget-catalog-dialog/widget-catalog.spec.ts` to drive via `DialogService`.

## Definition of done

- [ ] Catalog opens as an overlay-backed dialog with backdrop; gridster behind goes `inert`.
- [ ] Picking a widget closes the dialog and adds the widget.
- [ ] `W` keyboard shortcut still opens the catalog.
- [ ] Bespoke `widget-catalog-dialog__close` / `__header` styles are removed (chrome comes from `<ur-dialog>`).
- [ ] Tests pass.
- [ ] `git commit -m "T189: migrate widget-catalog to ur-dialog + DialogService overlay" && git push origin main`.
