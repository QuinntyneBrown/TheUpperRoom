# 36 - Logging and Observability ✅ Complete

**Traces to:** L2-044, L2-045 (L1-012).

This cross-cutting design makes backend and frontend logging acceptance-testable.

## Components

- Backend `Infrastructure/CorrelationIdMiddleware` - reads `X-Correlation-Id` or generates one, adds it to the response header and Serilog log context.
- Backend `Infrastructure/RequestLoggingMiddleware` - writes one structured JSON log per HTTP request.
- Backend `Infrastructure/ErrorHandlingMiddleware` - logs unhandled exceptions with stack trace and correlation ID, increments an error counter, returns generic `500`.
- Backend `Infrastructure/AuditLog` - helper for audit category events: role assignment, sign-in, sign-out, delete/restore, and rate-limit/lockout events.
- Backend `LogsController` - `POST /api/logs` accepts sanitized frontend log entries and tags them with `source="frontend"`.
- Frontend `app-shell/global-error-handler` - catches unhandled Angular errors and sends structured logs within 5 seconds.
- Frontend `api/correlation.interceptor` - adds or forwards correlation IDs.
- Frontend `api/http-error-logging.interceptor` - logs failed XHRs with secret stripping.

## Backend Log Fields

Every request log contains:

- `timestamp`
- `level`
- `correlationId`
- `eventName`
- `httpMethod`
- `path`
- `statusCode`
- `responseTimeMs`
- `userId` when authenticated
- `remoteIp`

Exception logs additionally include `exceptionType`, `message`, `stackTrace`, and `errorCounterName`.

Audit logs contain `category="audit"`, `actorUserId`, `targetId`, `action`, and `timestamp`.

## Frontend Log Contract

`POST /api/logs` body:

```json
{
  "timestamp": "2026-05-05T00:00:00Z",
  "level": "Error",
  "correlationId": "uuid-or-header-value",
  "route": "/partners/123",
  "userId": "optional",
  "message": "safe message",
  "stackTrace": "optional",
  "httpStatus": 500,
  "url": "/api/partners/123"
}
```

The backend rejects logs containing known secret fields (`password`, `token`, `cookie`, `authorization`, `session`) and truncates oversized logs.

## Acceptance Tests

- L2-044 AC1: any HTTP request emits one structured request log with the required fields.
- L2-044 AC2: an unhandled exception logs stack trace and correlation ID, increments an error counter, and returns a generic 500 body.
- L2-044 AC3: role assignment, sign-in, sign-out, delete, restore, lockout, and throttling emit audit logs.
- L2-045 AC1: an unhandled frontend error posts a structured log within 5 seconds.
- L2-045 AC2: an HTTP interceptor logs failed XHRs with echoed correlation ID and without secrets.
- L2-045 AC3: backend accepts valid frontend logs, rejects or sanitizes credential-bearing logs, and persists them with `source="frontend"`.

## Radical Simplicity Notes

- Logs go through Serilog JSON sinks. There is no separate audit database table until querying requirements demand one.
- One correlation ID flows through browser, API, logs, and response headers.
