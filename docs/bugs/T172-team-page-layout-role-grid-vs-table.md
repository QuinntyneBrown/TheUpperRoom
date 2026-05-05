# T172 — Team page: layout is flat table; design calls for role-based card grid

**Status:** Fixed ✓

## Description

The `Desktop / Team` design (`ZlcrR` roleGrid) shows team members grouped into 4 role cards (City Lead, Prayer Lead, Event Lead, Communication Lead). Each card shows which members hold that role. The implementation uses a flat HTML table with columns: Name | Roles | Email | Status.

## Design (ui-design.pen — node ZlcrR)

- 4 role cards (`role1–role4`): cornerRadius 8, fill `#101018`, gap 16, padding 20, stroke `#222233`
- Each card has:
  - Header (`r1Top`): role name + member count
  - Member row (`r1Mem`): cornerRadius 6, fill `#16161F`, gap 12, padding 12 — avatar + name

## Current Behaviour

Flat `<table>` with thead columns: Name, Roles, Email, Status.
Members are not grouped by role; roles are shown inline as chips.

## Expected Behaviour

4 role section cards in a 2×2 or horizontal grid:
- City Lead card — lists members with that role
- Prayer Lead card
- Event Lead card
- Communication Lead card

## Failing Tests

`frontend/e2e/tests/team/team-role-grid-layout.spec.ts`
