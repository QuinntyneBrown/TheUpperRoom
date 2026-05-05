# 49 — Dashboard Layout Restore and Last-Write-Wins ✅ Complete

**Traces to:** L2-035. L1-007.

Vertical slice: per-user dashboard layout persists, is restored on every device on sign-in, and the last write wins on concurrent edits.

## Components

- Backend `DashboardLayout { UserId (PK), Json: string, UpdatedAt }` (defined in slice 30).
- Backend `Dashboards/SaveMyDashboard.cs` upserts using EF Core `OnConflict`-style behavior: `db.DashboardLayouts.Upsert(...)` or equivalent provider call.
- Backend `Dashboards/GetMyDashboard.cs` returns the row by `UserId`, or empty layout `{"items":[]}` when missing.
- No version field, no merge — the second writer overwrites the first.

## API

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/api/dashboards/me` | – | `200 { json }` |
| PUT | `/api/dashboards/me` | `{ json }` (≤16 KB, valid JSON, has `items[]`) | `200` |

## Acceptance tests (L2-035)

- AC1: User signs out, signs back in on a different browser → exact layout restored.
- AC2: Two browsers edit concurrently → both PUTs return 200; final layout matches the last one written; no error surfaced.
- Payload >16 KB or missing `items[]` → 400.

## Radical simplicity notes

- One row per user. PK is `UserId`. No history.
- Last-write-wins is a deliberate product decision — collisions across devices are extremely rare for a personal layout, and a merge UI would be more confusing than a single clobber.
