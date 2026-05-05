# T89: Create Partner — dialog title and save button label mismatch

**Status:** Open

## Description

The Create Partner form at `/partners/new` shows incorrect text vs the design:

| Element | Design | Implementation |
|---|---|---|
| Dialog title | "New partner" | "Add partner" |
| Save button | "Create partner" | "Add partner" |

Design reference: `docs/ui-design.pen` → "Tablet / New Partner Modal" (node `RMIRE`)
- Title node `JMSuV`: "New partner"
- Submit button `jcOXq`: "Create partner"

## Affected Files

- `frontend/projects/feature-partners/src/lib/partner-create-page/partner-create-page.html`
  - Line 4: `title="Add partner"` → `title="New partner"`
  - Line 82: `'Add partner'` → `'Create partner'`
- `frontend/e2e/pages/partners-page.ts`
  - `create()` method uses `getByTestId('add-partner-btn')` — testid stays the same, no POM change needed for this field

## Fixed

`partner-create-page.html`: title → "New partner", button → "Create partner". Route title in `app.config.ts` updated to match. E2e test added in `partner-create-labels.spec.ts`. Rebuilt `dist/feature-partners` to apply template changes.
