# T54 — SignalR connected/offline/retry-exhausted states

**Status**: Accepted
**Phase**: 7 — Notifications and real-time lifecycle
**Area**: Real-time, Notifications
**Requirements**: L1-008, L2-036
**Source**: Screen-Level Missing Inventory — "SignalR connected/offline/retry-exhausted states"

## Goal

Define the visible app state for each phase of the SignalR connection lifecycle.

## Scope

- Connected: subtle indicator (dot or "live" pulse) in the top bar.
- Connecting/reconnecting: existing toast plus a persistent banner if it lasts > X seconds.
- Offline: banner with manual reconnect button; live data shows stale treatment (T13).
- Retry exhausted: persistent banner with explicit failure copy and reload-page CTA.
- Toast on successful reconnection.

## Acceptance criteria

- [ ] Connected, reconnecting, offline, retry-exhausted, and reconnected states designed.
- [ ] Banner is dismissible only when state is "connected".
- [ ] Mobile variants per T18.
