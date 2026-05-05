# T175 — Hackathon pages: wrong color tokens (light-mode fallbacks)

**Status:** Fixed ✓

## Description

Several hackathon components use light-mode / Slate CSS fallback values. On the dark theme these render as a pink error banner, near-white skeletons, and washed-out backgrounds.

## Affected files

### `hackathon-list-page.ts`

| Rule | Property | Wrong value | Correct value |
|---|---|---|---|
| `.hackathon-list-error` | background | `#fef2f2` (pink) | `color-mix(in srgb, #f87171 12%, transparent)` |
| `.hackathon-list-error` | color | `#dc2626` | `#f87171` (`--ur-danger`) |
| `.hackathon-list-error` | border | `#fecaca` | `color-mix(in srgb, #f87171 40%, transparent)` |
| `.hackathon-list-loading__card` | border | `#e2e8f0` (light) | `#222233` (`--ur-border-subtle`) |
| `.hackathon-list-loading__title/meta` | background | `#f1f5f9` (near-white) | `#2a2a3a` (`--ur-border-default`) |
| `.hackathon-list-toast` | background | `#1e293b` (Slate) | `#16161f` (`--ur-bg-surface`) |
| `.hackathon-list-page__empty` | color | `#64748b` (Slate) | `#a8a8b5` (`--ur-fg-muted`) |

### `hackathon-create-page.ts` & `hackathon-edit-page.ts`

| Rule | Property | Wrong value | Correct value |
|---|---|---|---|
| `.create-error-toast` / `.edit-error-toast` | background | `#1e293b` | `#16161f` (`--ur-bg-surface`) |
| `.create-error-toast` / `.edit-error-toast` | border | `--ur-error-fg, #dc2626` | `--ur-danger, #f87171` |
| `.hackathon-form__error` | color | `--ur-error-fg, #dc2626` | `--ur-danger, #f87171` |

## Failing Tests

`frontend/e2e/tests/hackathons/hackathon-list-colors.spec.ts`
