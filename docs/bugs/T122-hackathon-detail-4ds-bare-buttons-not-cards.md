# T122 — Hackathon detail: 4 D's section shows bare unstyled buttons

**Status**: Fixed

## Description

The 4 D's stage section on the hackathon detail page shows plain unstyled buttons stacked vertically with no visual differentiation.

The design shows each D as a card with:
- Phase marker badge (D1/D2/D3/D4 in a 36×36 circle, accent-soft for done/current, bg-elevated for upcoming)
- Phase label ("Discover", "Design", "Develop", "Deploy") as `$fs-lg` heading
- Status badge on the right: "Done", "In progress", or "Upcoming"
- Description text below (static per D)
- Accent border on active/done cards, subtle border on upcoming cards

## Steps to reproduce

1. Navigate to `/hackathons/:id`
2. Observe the stage section — shows Discover/Design/Develop/Deploy as plain buttons

## References
- Design: `Desktop / Hackathons` → `hcontent` → `fourD`: d1–d4 cards
- Phase markers: `d1Phase` (D1, accent-soft), `d2Phase`, `d3Phase` (D3, bg-elevated), `d4Phase`
