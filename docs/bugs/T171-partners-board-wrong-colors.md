# T171 — Partners board: wrong color tokens (Slate/light fallbacks instead of design palette)

**Status:** Fixed ✓

## Description

`partners-board-page.ts` uses Slate and light-mode fallback values for all color tokens instead of the design system's dark palette. This makes columns and cards appear with incorrect backgrounds.

## Design values (from ui-design.pen)

| Element | Property | Design value |
|---|---|---|
| Column | fill | `#101018` (`--ur-bg-elevated`) |
| Column | stroke | `#222233` |
| Card | fill | `#16161F` (`--ur-bg-surface`) |
| Card | stroke | `#2A2A3A` (`--ur-border-default`) |
| Card hover | border-color | `#9F86FF` (`--ur-accent-primary`) |
| Count | font | Geist Mono 11px, `#7A7A87` (plain text, no badge bg) |
| Skeleton | bg | `#2A2A3A` (dark, not light gray `#f1f5f9`) |
| Error | bg/fg/border | dark danger tokens, not light red |

## Current Behaviour

- Column: `--ur-bg-surface, #1e293b` (Slate 800 — too light)
- Column border: `--ur-border-subtle, #334155` (Slate 700)
- Card: `--ur-bg-elevated, #334155` (Slate 700 — way too light)
- Card border: `--ur-border-default, #475569` (Slate 600)
- Hover: `--ur-accent-primary, #6366f1` (Indigo instead of violet)
- Skeleton: `--ur-skeleton-bg, #f1f5f9` (near-white on dark bg — invisible)
- Error states: light red palette (wrong for dark theme)

## Failing Tests

`frontend/e2e/tests/partners/partners-board-colors.spec.ts`
