# T13 — Real-time chart refresh states

**Status**: Complete
**Phase**: 2 — Dashboard editor interaction model
**Area**: Dashboard, Real-time
**Requirements**: L1-007, L1-008, L2-034, L2-037
**Source**: Screen-Level Missing Inventory — "Dashboard real-time chart refresh states"

## Goal

Show how Chart.js cards behave when SignalR pushes new data, when the connection drops, and when data is stale.

## Scope

- Live state: subtle "live" pulse indicator next to the chart title.
- Updating state: shimmer or fade on the new data point.
- Stale state: muted overlay + "Last updated <relative time>" + manual refresh.
- Offline/disconnected chart state: greyed series + reconnect link tied to T54.

## Acceptance criteria

- [x] Live, updating, stale, and offline chart variants exist as component states.
- [x] States compose with the dashboard widget chrome from T10.
- [x] Indicator semantics are reflected in the legend or tooltip.
