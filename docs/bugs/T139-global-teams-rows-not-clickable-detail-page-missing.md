# T139 — Global teams: rows not clickable, team detail page missing

**Status**: Fixed ✓

## Description

Flow 35 requires clicking a team row on `/teams` to open a read-only detail page at `/teams/:id`. Two things are missing:

1. Table rows and cards have no `routerLink` — clicking a team does nothing.
2. No route `/teams/:id` and no `GlobalTeamDetailPageComponent` exists.

The API service already has `getGlobalTeam(id)` and `GlobalTeamDetailDto`, so the backend endpoint exists.

## Fix

1. Add `routerLink` to each table row and card in `global-teams-page.html`.
2. Create `GlobalTeamDetailPageComponent` that loads and displays basic team info.
3. Register route `{ path: 'teams/:id', component: GlobalTeamDetailPageComponent }` in `app.config.ts`.

## References

- Route: `/teams` → click a team row
- Component: `frontend/projects/feature-team/src/lib/global-teams-page/global-teams-page.html`
- New component: `frontend/projects/feature-team/src/lib/global-team-detail-page/`
- Route config: `frontend/projects/app-shell/src/app/app.config.ts`
