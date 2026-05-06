# T178 — Global search trigger renders 🔍 emoji instead of Material icon

**Status:** Fixed ✓

## Description

The global search trigger button in the sidebar footer (`<ur-global-search-overlay>`) renders a literal 🔍 emoji (U+1F50D) on a white background instead of a Material `search` icon.

This is visible on all viewport sizes where the sidebar/search-trigger is shown (Desktop ≥1280 — sidebar footer). It does not match the `.pen` design (`docs/ui-design.pen`) which uses Material Symbols Outlined `search` icon, fill `$fg-secondary`, transparent button background.

## Root cause

The source template `frontend/projects/feature-search/src/lib/global-search-overlay/global-search-overlay.html` correctly uses:

```html
<button ... mat-icon-button>
  <mat-icon>search</mat-icon>
</button>
```

But the **built library** at `frontend/dist/feature-search/fesm2022/feature-search.mjs` was compiled from an older version of the source that contained `🔍` (🔍 emoji) and no `mat-icon-button` directive. The app shell imports `feature-search` from `dist/`, so the stale build is what runs in the browser.

The source was fixed in commit `2eb2882` (`Replace emoji triggers with Material icons in notification center and search overlay`) but `feature-search` was never rebuilt.

## Reproduction

1. `npm start` and login at http://localhost:4200
2. Observe sidebar footer at viewport ≥1280 → 🔍 emoji on white background
3. Inspect element → `<button class="search-overlay__trigger"> 🔍 </button>` (no `<mat-icon>`)

## Expected (per `docs/ui-design.pen`)

The trigger should render a Material Symbols Outlined `search` glyph, with the same icon-button styling as the adjacent notifications/profile buttons.

## Fix applied

Rebuilt `feature-search` library: `npx ng build feature-search` — dist now matches the source. Verified in browser at 1440px: search button renders Material Symbols Outlined `search` glyph, matching adjacent notifications/profile icon-buttons.

**Regression prevention:** the new e2e test `frontend/e2e/tests/shell/global-search-trigger-icon.spec.ts` asserts the trigger contains a `<mat-icon>` with text `search` and no 🔍 emoji. CI will fail if the library dist is stale again.
