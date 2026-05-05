# T63 — E2E acceptance flow inventory

**Status**: Accepted
**Phase**: 10 — Component mapping and acceptance traceability
**Area**: QA, Architecture
**Requirements**: L2-063, L2-064
**Source**: Recommended Remediation Order — "acceptance-test flow inventory"

## Goal

Identify the primary flows the Playwright suite must cover and the responsive viewports each flow runs at, so design coverage and test coverage stay aligned.

## Scope

- List the major flows: register/verify/sign-in, password recovery, sign-out, contact create/edit/delete/search, partner create/stage-change/Kanban, hackathon create/stage/product, team invite/remove/role-change, dashboard add-widget/persist, global search, notification mark-as-read.
- For each: the screens involved, the responsive viewports required (per L2-064), and any state from this task pack the test must hit.
- Cross-reference each flow to the relevant T## tasks.

## Acceptance criteria

- [ ] Flow inventory document written.
- [ ] Each flow lists its screens, viewports, and referenced T## tasks.
- [ ] Document lives alongside specs to be consumed by the test team.
