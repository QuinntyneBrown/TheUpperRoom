# T134 — Notes panel: textarea is unstyled (white background) and note card CSS missing

**Status**: Fixed ✓

## Description

`NotesPanelComponent` has `styles: [...]` but only defines `.note-error-toast` and `.notes-panel__empty` CSS. The template uses several additional CSS classes that have no rules:

- `.notes-panel__add` — form container; no layout CSS, so textarea and Add button render misaligned
- `.notes-panel__textarea` — browser-default textarea: white background, black text — clashes with dark theme
- `.note-card` — no card/separator styling between notes
- `.note-card__body` — note text, no color/font override
- `.note-card__meta` — meta row (date + actions), no flex layout
- `.note-card__actions` — action buttons row, no flex layout
- `.note-card__confirm` — confirmation text, no styling

## Evidence

- Contact detail page screenshot: textarea is a plain white box in the dark UI
- No styles found for the above classes in `notes-panel.ts`

## Fix

Add the missing CSS classes to the `styles` array in `NotesPanelComponent`.

## References

- Route: `/contacts/:id`
- Component: `frontend/projects/feature-contacts/src/lib/notes-panel/notes-panel.ts`
