# T12 — Saved, restored, and conflict layout states

**Status**: Accepted
**Phase**: 2 — Dashboard editor interaction model
**Area**: Dashboard
**Requirements**: L1-007, L2-035
**Source**: Screen-Level Missing Inventory — "Dashboard saved/restored/conflict states"

## Goal

Cover what the user sees when their dashboard layout persists, when it is restored from another session, and when a conflict is detected.

## Scope

- Saved: brief toast "Layout saved" on commit.
- Restored: first-load notice "We restored your layout from <device/date>" with Dismiss.
- Conflict: dialog when a newer layout exists on the server (e.g., another tab). Options: "Use this device's layout", "Use server layout", "View diff".
- Failure-to-save state: retry toast with manual retry button.

## Acceptance criteria

- [ ] Toast and dialog frames exist for saved, restored, and conflict.
- [ ] Failure-to-save toast covers the offline/error case.
- [ ] Conflict dialog explains the trade-off and lets the user choose.
