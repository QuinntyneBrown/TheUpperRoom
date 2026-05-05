# 63 — Page-Load Performance Budget Harness

**Traces to:** L2-046. L1-013.

## Status
Complete

Vertical slice: a CI harness that runs Playwright with Chromium under Slow 4G + 4× CPU throttle and asserts page-load budgets per primary screen.

## Components

- Test project `tests/perf/page-load.spec.ts` — Playwright test that:
  1. Builds the production frontend.
  2. Starts the API + a seeded database (slice 64 seeder).
  3. For each primary screen, navigates and waits for a screen-specific "ready" signal.
  4. Captures `performance.timing` and Lighthouse-style metrics (FCP, LCP, TBT) using `playwright-lighthouse`.
  5. Asserts: `LCP < 2.5s`, `TBT < 200ms` on `Slow 4G` + Moto G4 emulation.
- Primary screens: dashboard, contacts list, partners list, partner board, hackathons list, global search overlay.
- Artifact: `perf-pageload.json` per run, plus the Lighthouse HTML report.

## CI

- Runs on every PR that touches the frontend or shared layouts; nightly on `main`.

## Acceptance tests (L2-046)

- Each primary screen passes its budget on the CI runner.
- Artifacts uploaded to the workflow run.

## Radical simplicity notes

- One spec file iterates the screen list. No bespoke perf framework.
- The "ready" signal is a `data-perf-ready` attribute set by each page's main component when its first paint of real data is complete.
