# Inline Dialog Audit

Audit of dialog usage across the frontend, identifying dialogs that are rendered **inline** (toggled into the page DOM via a signal/`@if`) rather than opened the traditional way through a dialog service that mounts the dialog into a CDK overlay/portal with a full-screen backdrop.

## TL;DR

- **There is no dialog service in this codebase.** No `MatDialog`, no `CdkDialog`, no `Overlay.create`, no custom `DialogService`. A repo-wide search for `MatDialog|CdkDialog|DialogService|Overlay\.open|overlay\.create|dialog\.open\(` returned **zero hits**.
- Every dialog is implemented by toggling a signal and rendering `<ur-dialog>` (or a sibling component that wraps it) directly inside a host component's template.
- `<ur-dialog>` itself (`projects/components/src/lib/dialog/dialog.{ts,html,scss}`) renders a plain `<mat-card>` with `role="dialog"`/`aria-modal="true"` and a focus trap, but the component **has no fixed positioning, no backdrop, no z-index lift, and is not centered or portaled**. It paints in normal document flow wherever the host puts it.
- Only **one** call site (`contacts-list-page`) wraps the dialog in a hand-rolled fixed-position dim overlay. Every other call site is fully inline.

## The dialog primitive

`projects/components/src/lib/dialog/dialog.ts:20` — `UrDialogComponent`

- Template root is `<mat-card appearance="outlined" role="dialog" aria-modal="true" cdkTrapFocus>` (`dialog.html:1`).
- Styles set `display: block` on the host, card colors, and padding — no `position: fixed`, no overlay, no backdrop (`dialog.scss:1`).
- Inputs: `title`, `subtitle`, `icon`, `variant`, `closeLabel`, `showClose`, `showActions`. Output: `closed`.

Because the component is unpositioned, every call site is responsible for backdrop/centering/z-index — and almost none provide it.

## Inline dialog call sites (no overlay/backdrop)

| # | Call site | File:line | Trigger | Notes |
|---|-----------|-----------|---------|-------|
| 1 | Remove team member confirm | `projects/feature-team/src/lib/local-team-page/local-team-page.html:58` | `removingMember()` signal | Dialog renders inline inside `.team-page__content`; appears in document flow. |
| 2 | Invite team member | `projects/feature-team/src/lib/invite-dialog/invite-dialog.html:1` (used at `local-team-page.html:13`) | `showInvite()` signal | The component itself is `<ur-dialog>` at root, rendered inline by the team page. |
| 3 | Delete contact | `projects/feature-contacts/src/lib/contact-detail-page/contact-detail-page.html:42` | `showDeleteDialog()` | Inline inside the detail page. |
| 4 | New contact dialog (component) | `projects/feature-contacts/src/lib/new-contact-dialog/new-contact-dialog.html:1` | n/a (component) | Component root is `<ur-dialog>`. **Sole call site is wrapped in an overlay** — see "With overlay" below. |
| 5 | Delete partner | `projects/feature-partners/src/lib/partner-detail-page/partner-detail-page.html:43` | `showDeleteDialog()` | Inline. |
| 6 | Move partner stage | `projects/feature-partners/src/lib/partner-detail-page/partner-detail-page.html:58` | `showStageDialog()` | Inline. |
| 7 | New partner (routed) | `projects/feature-partners/src/lib/partner-create-page/partner-create-page.html:1` | Route `partners/new` (`app.config.ts:51`) | The "dialog" is the entire routed page — no overlay, no parent layout context; user lands on a `<ur-dialog>` rendered as the page body. |
| 8 | Delete hackathon | `projects/feature-hackathons/src/lib/hackathon-detail-page/hackathon-detail-page.html:31` | `showDeleteDialog()` | Inline. |
| 9 | Plan hackathon (routed) | `projects/feature-hackathons/src/lib/hackathon-create-page/hackathon-create-page.html:1` | Route `hackathons/new` (`app.config.ts:46`) | Same pattern as #7 — a `<ur-dialog>` is the routed page root, with no overlay. |
| 10 | Add product | `projects/feature-hackathons/src/lib/products-section/products-section.html:34` | `showForm()` | Inline at the bottom of the section component's template. |
| 11 | Widget catalog | `projects/feature-dashboard/src/lib/widget-catalog-dialog/widget-catalog-dialog.ts:6` (used at `dashboard-page.html:11`) | `showCatalog()` | Not a `<ur-dialog>` — a bespoke `ur-widget-catalog-dialog` component with its own card-like styles. **No overlay, no backdrop, no fixed positioning** — paints in dashboard flow above the gridster. |
| 12 | Dialog test harness | `projects/app-shell/src/app/test/dialog-test.ts:10` | `isOpen()` | Test scaffold; documents the inline pattern. |

### Behavioral consequences of being inline

For all of items 1–11 above:

- No backdrop, no scrim — content behind remains visually full-strength and clickable. Clicks outside the dialog pass through to underlying widgets/buttons; only `Escape` closes them (handled by `<ur-dialog>` itself).
- No portaling — the dialog inherits stacking context, transforms, and `overflow:hidden` of the nearest positioned/clipping ancestor. Long dialogs can be clipped by parent containers (e.g. inside `.team-page__content`, inside `gridster`, inside `<section>`).
- No centering — placement depends entirely on where the `@if` block sits in the host template. The remove-member dialog appears below the role grid, not over it; the add-product dialog appears below the products list.
- No focus management beyond the local `cdkTrapFocus` on the card — but because the rest of the page is not `inert`, screen reader / tab focus can still reach background content if the trap is bypassed.
- Multiple dialogs coexist trivially (e.g. `partner-detail-page` has both `showDeleteDialog` and `showStageDialog` toggles in adjacent `@if` blocks) with no stacking/z-index discipline.

## Dialogs that DO have an overlay/backdrop

These are the exceptions, all hand-rolled (still no dialog service):

| # | Call site | File:line | Mechanism |
|---|-----------|-----------|-----------|
| A | New contact (from contacts list) | `projects/feature-contacts/src/lib/contacts-list-page/contacts-list-page.html:128`, styles at `contacts-list-page.ts:89` | Wraps `<ur-new-contact-dialog>` in `<div class="contacts-list-page__overlay">` with `position: fixed; inset: 0; background: rgba(10,10,15,0.7); z-index: 1000;`. The only call site that gives `<ur-dialog>` the modal chrome it visually expects. |
| B | Global search | `projects/feature-search/src/lib/global-search-overlay/global-search-overlay.html:11` | Not a `<ur-dialog>`. Bespoke modal: `.search-overlay` with its own `.search-overlay__backdrop` div and `.search-overlay__panel`. Cmd/Ctrl-K toggle, `Escape` to close, click-on-backdrop to close. |

## Inconsistencies worth flagging

1. **`<ur-dialog>` is named/typed as a modal dialog (`role="dialog"`, `aria-modal="true"`) but renders as inline content.** That is misleading both to assistive tech and to anyone reading the code expecting an Angular Material-style overlay. Either the component should provide its own portal+backdrop, or the role/aria should be downgraded to a non-modal disclosure.
2. **`new-contact-dialog` is the only call site that supplies the missing overlay shell** — and it does so inline in the contacts list page rather than in a reusable wrapper. Every other delete/edit/create flow has none.
3. **Routed "dialogs" (`partner-create-page`, `hackathon-create-page`)** use `<ur-dialog>` as their full-page root. They behave like pages, not dialogs — closing emits `closed` which navigates back. Visually they read as a card on a blank route, not as a modal over the list page they were launched from.
4. **No central dialog service** means there is no shared place to enforce things like: backdrop, body-scroll lock, focus return, z-index order, ARIA `inert` on background, or stacking when multiple dialogs open. Each call site reimplements (or omits) these.
5. **Two separate "dialog" components exist** — `<ur-dialog>` and `<ur-widget-catalog-dialog>` — with overlapping responsibilities and inconsistent styling/behavior. The widget catalog reimplements the close button, header, body, and section-label styling rather than using `<ur-dialog>`.

## Recommended follow-ups (not implemented here)

- Introduce a real `DialogService` (or adopt `@angular/cdk/dialog` / `MatDialog`) so the call site says `dialog.open(MyDialogComponent, {...})` and the service handles portal, backdrop, focus management, ARIA `inert`, and stacking.
- Have `<ur-dialog>` either render itself in a portal with a backdrop, or be renamed/restyled to make clear it is an inline panel (not a modal).
- Migrate items 1, 3, 5, 6, 8, 10 to the new service so they get a backdrop and no longer paint inside their host's clipping/scroll context.
- Fold `<ur-widget-catalog-dialog>` into `<ur-dialog>` (custom body slot) once `<ur-dialog>` is a real overlay.
- Decide what `partner-create-page` and `hackathon-create-page` are: routed pages or dialogs launched from the list. Today they are neither cleanly.

## Search methodology

- `grep -rn '<ur-dialog'` → 10 template files (item count above includes the `dialog-test.ts` harness and `widget-catalog-dialog` separately).
- `grep -rn 'MatDialog|CdkDialog|DialogService|dialog\.open\(|DialogRef|Overlay\.open|overlay\.create'` → 0 hits.
- `grep -rn 'overlay|backdrop'` → 13 files; only `contacts-list-page` and `global-search-overlay` use it for dialog chrome. The rest are token files, toast styles, or unrelated.
- Inspected `dialog.scss` to confirm the component itself has no positioning/backdrop.
