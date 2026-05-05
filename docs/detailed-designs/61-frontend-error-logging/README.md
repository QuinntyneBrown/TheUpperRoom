# 61 — Frontend Global Error Logging

**Traces to:** L2-045 AC1, AC3. L1-011.

## Status
Accepted

Vertical slice: any unhandled frontend error reaches the backend within 5 s with sanitized context.

## Components

- Frontend `app-shell/global-error-handler` — replaces Angular's `ErrorHandler`. Captures error, route URL, app version, browser UA, and correlation ID (from last `X-Correlation-Id` response if any). Calls `LogService.report(error)`.
- Frontend `LogService.report` posts to `POST /api/logs` with the sanitized payload; sanitization strips fields named `password`, `token`, `authorization`, `cookie`, `email`.
- Backend `Logs/CreateLog.cs` — accepts `{ level, message, stack, route, version, userAgent, correlationId }`. Validates length (`message ≤ 500`, `stack ≤ 16 KB`). Writes one Serilog entry tagged `Source=frontend`.
- Backend `LogsController.Post` — `[Authorize]`, body limit 32 KB.

## API

| Method | Path | Auth | Body |
|---|---|---|---|
| POST | `/api/logs` | required | `{ level, message, stack?, route, version, userAgent, correlationId? }` |

## Acceptance tests (L2-045)

- AC1: a thrown error in any component is delivered to `/api/logs` and visible in backend logs within 5 s.
- AC3: a payload containing a field named `password` is dropped before transport; backend log has no `password` field.

## Radical simplicity notes

- One handler, one endpoint. No batching, no offline queue.
- Sanitization is a fixed deny-list of field names; not a regex over values.
