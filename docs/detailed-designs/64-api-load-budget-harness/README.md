# 64 — API Load and Seeded Data Budget Harness

**Traces to:** L2-047. L1-013.

## Status
Complete

## Design note
k6/bombardier require external tooling. Per radical simplicity, the harness is a .NET integration test using `WebApplicationFactory<Program>` + `Task.WhenAll` to fire concurrent requests and assert p95 latency from in-process timing. Endpoints that are not yet implemented are marked `[Fact(Skip = "...")]`.

Vertical slice: a CI harness that seeds expected production volume and asserts API percentile budgets for GET, mutation, and search.

## Components

- Backend `tools/seed-perf` — deterministic generator producing 100 teams × (5,000 contacts + 500 partners + 50 hackathons) ≈ realistic volume. Idempotent on a clean database.
- Test project `tests/perf/api-budget.spec.ts` — `k6` or `bombardier` script driven from CI:
  - `GET /api/contacts` (paged), `GET /api/partners?stage=...`, `GET /api/search?q=...`, `POST /api/contacts`.
  - 50 concurrent virtual users, 60 s duration each.
  - Asserts: `GET p95 < 300ms`, `mutation p95 < 500ms`, `search p95 < 700ms`.
- Output: `perf-api.json` summary uploaded as a CI artifact.

## CI

- Runs nightly and on labels `perf` or PRs touching backend handlers.

## Acceptance tests (L2-047)

- Budget targets met against the seeded database on the CI runner.
- Summary artifact uploaded.

## Radical simplicity notes

- One seeder, one scenario file. No load-testing platform.
- Seed scale is fixed for now. Tunability is only added once a budget changes.
