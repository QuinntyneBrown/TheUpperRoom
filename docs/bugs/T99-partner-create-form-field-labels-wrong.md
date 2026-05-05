# T99: Partner create form — field labels wrong

**Status:** Fixed

## Description

Two field labels on the "New partner" create form differ from the design:

| Field | Design | Implementation |
|---|---|---|
| Name field | `Partner name` | `Organization name` |
| Stage field | `Stage` | `Status` |

Design reference: `docs/ui-design.pen` → New Partner Modal (desktop), nodes `LCJBW` (Partner name *), `T0Ag7e` (Stage)

## Affected Files

- `frontend/projects/feature-partners/src/lib/partner-create-page/partner-create-page.html`
  - Change label from `Organization name` to `Partner name`
  - Change label from `Status` to `Stage`
