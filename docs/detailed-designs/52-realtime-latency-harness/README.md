# 52 — Realtime Latency Budget Harness

**Traces to:** L2-048. L1-013.

Vertical slice: a CI test that publishes 100 events between two connected clients and asserts p95 ≤ 2 s and p99 ≤ 5 s.

## Components

- Test project `tests/realtime-latency` — Playwright fixture.
- The harness:
  1. Authenticates two test users in the same team.
  2. Opens two browser contexts, each connected to `/hubs/team`.
  3. Iteratively `POST /api/contacts` 100 times from client A; client B records `Date.now()` on receipt minus the server `timestamp`.
  4. Computes p50/p95/p99 and writes `realtime-latency.json` to the CI artifact directory.
  5. Fails the test if `p95 > 2000ms` or `p99 > 5000ms`.

## CI

- A dedicated GitHub Actions job runs this harness on every PR that touches `Realtime/` or `realtime.service.ts`, plus nightly on `main`.
- Artifact is uploaded with the run.

## Acceptance tests (L2-048)

- 100 events delivered with p95 ≤ 2 s and p99 ≤ 5 s on the CI runner.
- JSON artifact uploaded to the workflow run.

## Radical simplicity notes

- Reuses the existing `contactCreated` event — no special test event type.
- One test, one artifact. No latency dashboard, no Grafana wiring at this stage.
- Two browser contexts in one process — no test agent infrastructure.
