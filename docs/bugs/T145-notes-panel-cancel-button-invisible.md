# T145 — Notes panel Cancel buttons invisible (ghost ur-button in @else if branch)

**Status**: Fixed ✓

## Description

`NotesPanelComponent` has Cancel buttons in the edit and delete confirmation states:
- `<ur-button variant="ghost" (click)="cancelEdit()">Cancel</ur-button>`
- `<ur-button variant="ghost" (click)="cancelDelete()">Cancel</ur-button>`

These render with an empty `ur-button__label` span — the "Cancel" text is not projected into `<ng-content />` because the ghost variant is inside an `@else if` branch in `ur-button`'s template. Angular's new control flow syntax does not project text content into `<ng-content />` inside `@else if` branches.

The primary/flat variant (the `@else` / final branch) works correctly.

## Fix

Replace `<ur-button variant="ghost">Cancel</ur-button>` with `<button mat-button (click)="...">Cancel</button>` — bypasses the content projection issue entirely.

## References

- Template: `frontend/projects/feature-contacts/src/lib/notes-panel/notes-panel.html`
