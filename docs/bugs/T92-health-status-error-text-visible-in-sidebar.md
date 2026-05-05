# T92: Health status "ERROR" text visible in sidebar footer — not in design

**Status:** Open

## Description

The app shell sidebar footer renders `{{ healthStatus() }}` as visible text (`data-testid="health-status"`). When the `/api/health` endpoint fails or is unreachable, this displays "ERROR" to the user in the navigation area.

The design has no health status text indicator in the sidebar. This is an undesigned debug element that leaks implementation details to the user.

## Design reference

`docs/ui-design.pen` — sidebar frames (e.g. "Desktop / Contacts" → Sidebar frame `DNX7r`): no health status element present.

## Affected Files

- `frontend/projects/app-shell/src/app/app.html`
  - Line 40: Remove `<span data-testid="health-status" class="shell__api-status">{{ healthStatus() }}</span>`
- `frontend/projects/app-shell/src/app/app.ts`
  - Remove `healthStatus` signal and display logic (keep the health check subscription itself for error logging if needed)

## Fix

Remove the visible health status span. The health check can remain as a background check (logged to console via `GlobalErrorHandler`) without showing raw status text in the UI.
