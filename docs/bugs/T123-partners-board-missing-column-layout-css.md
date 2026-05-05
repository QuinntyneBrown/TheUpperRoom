# T123 — Partners board: columns have no CSS, stacking vertically

**Status**: Open

## Description

The partners board page at `/partners/board` loads data correctly but has no CSS for the board layout. All three columns (Lead, In funnel, Confirmed) stack vertically instead of being arranged side by side.

The design shows:
- Three horizontally-arranged columns
- Each column: rounded card bg-surface, gap $sp-3, padding $sp-3, subtle border
- Partner cards inside each column: bg-elevated, rounded, name + city text

Also: the CTA button says "Add partner" but design says "New partner".

## Steps to reproduce

1. Navigate to `/partners/board`
2. The Lead/In funnel/Confirmed columns stack vertically

## References
- Design: `Desktop / Partners - Board` → `k6FA3` (board): colLead, colFunnel, colConfirmed_empty arranged horizontally
- Cards: `c1a` — bg-elevated, radius-md, padding $sp-3
