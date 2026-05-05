# T168 — Notes panel: edit and delete always call contact service, ignoring targetType

**Status:** Fixed ✓

## Description

`NotesPanelComponent.saveEdit()` (line 107) and `doDelete()` (line 135) always call `this.contacts.updateNote` / `this.contacts.deleteNote` regardless of `targetType()`. Only `addNote()` correctly branches on `targetType`. Editing or deleting a note on the **partner detail page** silently calls the wrong API endpoint.

## Current Behaviour

```ts
saveEdit(noteId: string): void {
  // ...
  this.contacts.updateNote(noteId, body).subscribe(...)  // ← always contacts!
}

doDelete(noteId: string): void {
  this.contacts.deleteNote(noteId).subscribe(...)  // ← always contacts!
}
```

## Expected Behaviour

Both methods should branch on `targetType()` the same way `addNote()` does:

```ts
const update$ = this.targetType() === 'Partner'
  ? this.partners.updateNote(noteId, body)
  : this.contacts.updateNote(noteId, body);
```

## Failing Tests

`frontend/e2e/tests/partners/partner-note-edit-delete.spec.ts`
