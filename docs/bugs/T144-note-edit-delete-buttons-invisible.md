# T144 — Note edit/delete button labels empty — buttons invisible to user

**Status**: Fixed ✓

## Description

In `NotesPanelComponent`, the Edit and Delete note action buttons use `<ur-button variant="ghost">Edit</ur-button>` and `<ur-button variant="ghost">Delete</ur-button>`. The `ur-button` ghost template projects content via `<span class="ur-button__label"><ng-content /></span>`, but the text nodes "Edit" and "Delete" do not project into the span — the span renders empty. The buttons are present in the DOM but have no visible label, making them effectively invisible.

Root cause: Angular content projection of bare text nodes into `<ng-content />` inside nested `@if`/`@else if` blocks in the new control flow syntax.

## Fix

Replace `<ur-button variant="ghost">` text buttons with `button[mat-icon-button]` using Material Icons (`edit`, `delete`) for the note edit and delete actions. Icon buttons are unambiguous, visually clear, and match the design's icon-button pattern for compact note card actions.

## References

- Template: `frontend/projects/feature-contacts/src/lib/notes-panel/notes-panel.html`
- Component: `frontend/projects/feature-contacts/src/lib/notes-panel/notes-panel.ts`
