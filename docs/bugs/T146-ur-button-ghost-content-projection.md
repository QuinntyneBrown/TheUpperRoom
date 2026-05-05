# T146 — ur-button ghost/outline variants: text content not projected

**Status**: Fixed ✓

## Description

`ur-button`'s template uses Angular 17+ control flow (`@if / @else if / @else`). Text content passed as `<ng-content />` only projects correctly into the final `@else` branch (primary/flat). All `@else if` branches — `ghost`, `outline`, `secondary`, `danger` — render empty `ur-button__label` spans when text-only content is passed.

Affected usages throughout the app:
- `notes-panel.html` — Cancel in edit/delete states (fixed separately in T145)
- `products-section.html` — Cancel in Add Product form
- `local-team-page.html` — Remove/Cancel buttons
- `invite-dialog.html` — Cancel
- `hackathon-create-page.html` — Cancel
- `partner-edit-page.html`, `partner-create-page.html` — Cancel
- `partner-contacts-panel.html` — Associate/Cancel

## Root Cause

Angular's new control flow syntax does not project text content into `<ng-content />` inside `@else if` branches — only the `@else` (final fallback) branch receives projected content.

## Fix

Add `<ng-template #content><ng-content /></ng-template>` at the top of `button.html` to capture projected content once, then replace all `<ng-content />` inside `@else if` branches with `<ng-container *ngTemplateOutlet="content" />`. This pattern works because content is captured by the template (not conditional), then rendered wherever needed.

## References

- Component: `frontend/projects/components/src/lib/button/button.ts`
- Template: `frontend/projects/components/src/lib/button/button.html`
