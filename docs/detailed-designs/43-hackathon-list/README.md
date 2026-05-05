# 43 — Hackathon List and Navigation

**Traces to:** L2-025 (list portion), L2-046, L2-063. L1-006.

Vertical slice: a team-scoped hackathon list page that fills the gap between create (slice 21) and detail (slice 24).

## Components

- Backend `Hackathons/ListHackathons.cs` — `Query { }` returns the current team's hackathons ordered by `StartDate DESC`. Team-scoped via `ITeamScopedRequest`.
- Backend `HackathonsController` adds `GET /api/hackathons`.
- Frontend `feature-hackathons/hackathon-list-page` — route `/hackathons`. Mobile cards (title, date range, host city, current 4D stage); desktop table (same columns + actions).
- Frontend list rows link to `/hackathons/{id}` (slice 24).

## API

| Method | Path | Response |
|---|---|---|
| GET | `/api/hackathons` | `200 [{ id, title, startDate, endDate, hostCity, currentStage }]` |

## Acceptance tests

- L2-025 AC: team member sees only their team's hackathons.
- L2-025 AC: rows show title, dates, host city, current stage; clicking a row opens detail.
- L2-046: hackathon list meets page-load budget at seeded volume.
- L2-063: E2E flow visits the list before drilling into detail.

## Radical simplicity notes

- One query, no filters. Stage filter can ride in later if needed.
- Sort is fixed (`StartDate DESC`). No client-side sort UI yet.
