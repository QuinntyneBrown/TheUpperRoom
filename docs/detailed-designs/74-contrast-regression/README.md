# 74 — Contrast Regression Checks

**Traces to:** L2-059. L1-015.

Vertical slice: an automated gate that recomputes WCAG contrast for every text token pair, every focus/error/icon pair, and every chart pair on every PR.

## Components

- Test `tests/a11y/contrast.spec.ts` — for each pair `(foreground, background)` enumerated from the token file:
  - Asserts `text-primary` vs all surfaces ≥ 7:1 (AAA target where applied).
  - Asserts every text token vs every surface it can appear on ≥ 4.5:1 (3:1 for large text).
  - Asserts focus, error, status, and chart pairs ≥ 3:1.
- Pair enumeration is read from `tokens.scss` (slice 56) at test time so adding a token automatically extends coverage.
- Test fails on any single violation with a clear message naming the offending pair.

## Acceptance tests (L2-059)

- Every token pair declared as adjacent passes its contrast threshold.
- Adding a new token without updating the adjacency map fails the test until the map is updated.

## Radical simplicity notes

- Token-level math, not pixel sampling. Fast, deterministic, and reflects the design intent rather than an instance.
- Adjacency map is a small TypeScript constant; no runtime DOM walking.
