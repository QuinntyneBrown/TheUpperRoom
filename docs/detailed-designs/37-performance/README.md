# 37 - Performance and Scalability

**Traces to:** L2-046, L2-047 (L1-013).

This cross-cutting design defines how performance budgets are measured.

## Components

- Frontend `frontend/e2e/performance.spec.ts` - Playwright plus Lighthouse CI against production build.
- Backend `backend/tests/Performance` - xUnit or k6-driven API load tests using seeded data.
- Seed data generator creates 50 teams, 50 concurrent users per team profile, and 10,000 records per searchable entity.
- CI stores performance artifacts: Lighthouse JSON, API percentile summaries, and SignalR latency summaries from slice 32.

## Page Load Budgets

Primary screens:

- sign-in
- dashboard
- contact list
- partner list
- partner board
- hackathon list
- team

Each screen is tested cold and warm on a Slow 4G profile and Moto G4-class device emulation.

## API Budgets

- GET endpoints: p95 <=300 ms, p99 <=800 ms.
- POST/PUT/DELETE endpoints: p95 <=500 ms, p99 <=1200 ms.
- Search over 10,000 records per type: p95 <=500 ms.

## Acceptance Tests

- L2-046 AC1: cold loads meet LCP <=2.5 s and TTI <=3.5 s.
- L2-046 AC2: warm loads meet LCP <=1.5 s.
- L2-046 AC3: Lighthouse performance >=80 and accessibility >=95.
- L2-047 AC1/AC2: seeded-load API tests assert GET and mutation percentile budgets.
- L2-047 AC3: search endpoint over 10,000 records per type meets p95 <=500 ms.

## Radical Simplicity Notes

- Performance tests use the same app and database schema as E2E. No synthetic service doubles.
- Caching is added only after a failing performance budget proves it is needed.
