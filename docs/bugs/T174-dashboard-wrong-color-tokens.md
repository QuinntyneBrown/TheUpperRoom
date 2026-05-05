# T174 — Dashboard page: wrong color tokens (light-mode fallbacks)

**Status:** Fixed ✓

## Description

`dashboard-page.ts` uses Slate/light-mode CSS fallback values. On the dark theme these render as a pink error banner, near-white border on the header, and washed-out backgrounds for the empty zone, snackbar, and toasts.

## Problematic rules

| Rule | Property | Wrong value | Correct value |
|---|---|---|---|
| `.dashboard-page__header` | border-bottom | `#e2e8f0` (light gray) | `#222233` (`--ur-border-subtle`) |
| `.dashboard-page__empty-zone` | background | `#1e293b` (Slate) | `#101018` (`--ur-bg-elevated`) |
| `.dashboard-page__empty-zone` | border | `#334155` (Slate) | `#2a2a3a` (`--ur-border-default`) |
| `.dashboard-load-error` | background | `#fef2f2` (pink) | `color-mix(in srgb, #f87171 12%, transparent)` |
| `.dashboard-load-error` | color | `#dc2626` (bright red) | `#f87171` (`--ur-danger`) |
| `.dashboard-load-error` | border | `#fecaca` | `color-mix(in srgb, #f87171 40%, transparent)` |
| `.dashboard-snackbar` | background | `#1e293b` (Slate) | `#16161f` (`--ur-bg-surface`) |
| `.dashboard-toast--saved` | background | `#1e293b` | `#16161f` |
| `.dashboard-toast--error` | background | `#1e293b` | `#16161f` |

## Failing Tests

`frontend/e2e/tests/dashboard/dashboard-colors.spec.ts`
