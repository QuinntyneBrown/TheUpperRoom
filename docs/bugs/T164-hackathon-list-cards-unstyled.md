# T164 — Hackathon list: cards are unstyled plain rows

**Status:** Fixed ✓

## Description

The hackathon list page (`/hackathons`) renders each hackathon as a plain text row with a bottom-border separator. The design (Mobile / Hackathons, `mhCard`) specifies a card with `$bg-elevated` fill, 1px `$accent-primary` border, `$radius-lg` corner radius, and padding — plus a visual stage badge instead of plain text in the subtitle.

## Design (ui-design.pen)

Frame: `Mobile / Hackathons` (`wG1J1`) — scroll area `AZY9z`, card `Ne79Z`:
- `fill: $bg-elevated` (#101018), `stroke: $accent-primary` (1px), `cornerRadius: $radius-lg` (8px)
- `padding: $sp-5` (20px), `gap: $sp-3` (12px)
- Left: title (16px, 600, `$fg-primary`) + date subtitle (Geist Mono, 11px, `#A8A8B5`)
- Right: stage badge chip (active = accent-primary, inactive = muted)
- Content area has `gap: $sp-4`, `padding: $sp-4`

Topbar (`UF66I`): `fill: $bg-elevated` (#101018) — not `$bg-surface`.

## Current Behaviour

- Cards render as borderless text rows with a 1px bottom separator.
- No background, no border, no radius — look like a plain list.
- Stage appended as plain text in the subtitle: "Toronto · Jun 1–3 · Discover".
- Header uses `$bg-surface` (#1e293b) instead of `$bg-elevated`.

## Expected Behaviour

- Each hackathon renders as a card: `$bg-elevated` background, 1px `$accent-primary` border, 8px radius.
- Stage shown as a colored badge chip on the right side of the card header.
- Content area uses `gap: 16px` between cards, `padding: 16px`.
- Page header uses `$bg-elevated` background.

## Failing Tests

`frontend/e2e/tests/hackathons/hackathon-list-card-styling.spec.ts`
