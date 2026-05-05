# 42 — Partner List Stage Filtering

**Traces to:** L2-021 (list/filter portion only), L2-046. L1-005, L1-013.

Vertical slice: a flat partner list page with stage filter chips, isolated from the Kanban board (slice 20) so list/filter performance and acceptance tests are independent.

## Components

- Backend `Partners/ListPartners.cs` already exists — extended to accept `?stage=` query param (zero or more values). Filter applied as `Where(p => stages.Contains(p.Stage))`.
- Frontend `feature-partners/partner-list-page` — route `/partners` (default; the Kanban lives at `/partners/board`).
- Frontend `partner-list-page` renders chip group of seven funnel stages (multi-select). Selected stages are URL-synced (`?stage=Identified&stage=Engaged`). Empty filter = all stages.
- Frontend list view: cards on `<lg`, table on `>=lg` (per slice 54).

## API

| Method | Path | Query | Response |
|---|---|---|---|
| GET | `/api/partners` | `stage[]` | `200 [{ id, name, stage, lastContactedAt }]` |

## Acceptance tests

- L2-021 AC (list portion): selecting one stage chip filters the list to matching partners.
- L2-021 AC: deselecting all chips returns the full list.
- L2-021 AC: URL deep-link with `?stage=Engaged` opens the page pre-filtered.
- L2-046: partner list at seeded production volume meets the page-load budget on Slow 4G/Moto G4.

## Radical simplicity notes

- Filter is a SQL `IN` clause. No faceted-search engine.
- Chips state lives in the URL. No local store, no service.
- Mobile uses the same chip row (horizontal scroll if needed). No filter drawer.
