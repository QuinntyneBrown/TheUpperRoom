# T173 — Team page: wrong color tokens (light-mode fallbacks in dark theme)

**Status:** Fixed ✓

## Description

`local-team-page.ts` uses light-mode CSS fallback values for error states, skeletons, and borders. On the dark theme these render as bright pink error banners and near-white loading skeletons.

## Problematic rules

| Rule | Property | Wrong value | Correct value |
|---|---|---|---|
| `.team-load-error` | background | `#fef2f2` (pink) | `color-mix(in srgb, #f87171 12%, transparent)` |
| `.team-load-error` | color | `#dc2626` (bright red) | `#f87171` (`--ur-danger`) |
| `.team-load-error` | border | `#fecaca` | `color-mix(in srgb, #f87171 40%, transparent)` |
| `.team-loading__row` | background | `#f1f5f9` (near-white) | `#2a2a3a` (`--ur-border-default`) |
| `.team-page__empty` | color | `#64748b` (Slate) | `#a8a8b5` (`--ur-fg-muted`) |
| `.team-table th` | border-bottom | `#334155` (Slate) | `#222233` (`--ur-border-subtle`) |
| `.team-table td` | border-bottom | `#334155` | `#222233` |
| `.team-card` | background | `#1e293b` (Slate) | `#16161f` (`--ur-bg-surface`) |
| `.team-card` | border | `#334155` | `#222233` |
| `.team-error-toast` | background | `#1e293b` | `#16161f` |

## Failing Tests

`frontend/e2e/tests/team/team-page-colors.spec.ts`
