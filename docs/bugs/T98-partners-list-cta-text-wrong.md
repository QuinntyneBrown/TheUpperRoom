# T98: Partners list — CTA button text should be "New partner"

**Status:** Fixed

## Description

The primary action button on the Partners list page reads "Add Partner" but the design shows "New partner".

| Element | Design | Implementation |
|---|---|---|
| Header CTA | `New partner` | `Add Partner` |

Design reference: `docs/ui-design.pen` → Partners List top bar, node `Xfl4P` content: `New partner`

## Affected Files

- `frontend/projects/feature-partners/src/lib/partner-list-page/partner-list-page.ts`
  - Change button text from `Add Partner` to `New partner`
