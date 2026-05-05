# 58 — Backend Correlation and Request Logging

**Traces to:** L2-044 AC1. L1-011.

## Status
Complete

Vertical slice: every request gets a correlation ID and a structured request log line.

## Components

- Backend `Observability/CorrelationMiddleware.cs` — reads `X-Correlation-Id` header or generates `Guid.NewGuid()`. Stores in `HttpContext.Items["CorrelationId"]` and writes back as response header `X-Correlation-Id`.
- Backend `Observability/RequestLoggingMiddleware.cs` — wraps the pipeline, logs `Information`:
  ```
  { correlationId, userId?, method, path, status, durationMs }
  ```
- `Program.cs` registers the middlewares before authentication so unauthenticated paths still log.
- `Serilog` JSON sink writes to stdout; deployment forwards to the log aggregator.

## Acceptance tests (L2-044 AC1)

- A normal `GET /api/contacts` produces one log line containing all six fields and a duration in milliseconds.
- The response includes an `X-Correlation-Id` header; supplying that header on the request reuses the same ID.
- Two concurrent requests have distinct correlation IDs.

## Radical simplicity notes

- Two short middlewares. No logging library beyond Serilog defaults.
- Correlation ID is the only identifier we track at this layer; no span IDs or distributed tracing yet.
