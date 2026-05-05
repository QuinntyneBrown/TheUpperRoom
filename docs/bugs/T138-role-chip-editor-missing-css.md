# T138 — Role chip editor: missing CSS (no active/inactive visual distinction)

**Status**: Fixed ✓

## Description

`RoleChipEditorComponent` styles array only defines `.role-chip-error`. The template uses:

- `.role-chips` — chip container, no flex/wrap layout
- `.role-chip` — each chip button, renders as plain browser default button (white background, no styling)
- `.role-chip--active` — active/assigned role, no visual highlight
- `.role-chip--disabled` — disabled state, no visual muting

Result: all role chips look identical regardless of whether the member has that role or not; active vs inactive is indistinguishable.

## Fix

Add missing CSS classes to `RoleChipEditorComponent` styles array.

## References

- Route: `/team`
- Component: `frontend/projects/feature-team/src/lib/role-chip-editor/role-chip-editor.ts`
