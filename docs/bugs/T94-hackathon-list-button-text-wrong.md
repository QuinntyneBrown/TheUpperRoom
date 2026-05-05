# T94: Hackathon list — "New Hackathon" button should be "+ Plan hackathon"

**Status:** Fixed

## Description

The primary action button on the Hackathon list page reads "New Hackathon" but the design shows "+ Plan hackathon".

| Element | Design | Implementation |
|---|---|---|
| Header CTA | `+ Plan hackathon` | `New Hackathon` |

Design reference: `docs/ui-design.pen` → hackathons list top-bar, node `Xfl4P` content: `+ Plan hackathon`

## Affected Files

- `frontend/projects/feature-hackathons/src/lib/hackathon-list-page/hackathon-list-page.ts`
  - Change button text from `New Hackathon` to `+ Plan hackathon`

## Fixed

- Changed `<a mat-raised-button>New Hackathon</a>` → `+ Plan hackathon` in inline template
