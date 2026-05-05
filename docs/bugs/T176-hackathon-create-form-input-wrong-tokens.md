# T176 — Hackathon create form: input fields use wrong color tokens

**Status:** Open

## Description

`hackathon-create-page.ts` uses Slate/navy CSS fallback values for form input fields.

## Problematic rules

| Rule | Property | Wrong value | Correct value |
|---|---|---|---|
| `input[type=text], input[type=date]` | border | `#475569` (Slate 600) | `#2a2a3a` (`--ur-border-default`) |
| `input[type=text], input[type=date]` | background | `#0f172a` (Navy) | `#101018` (`--ur-bg-elevated`) |

## Failing Tests

`frontend/e2e/tests/hackathons/hackathon-create-input-colors.spec.ts`
