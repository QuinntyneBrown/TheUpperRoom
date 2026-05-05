# 62 — HTTP Error Logging and Sanitization

**Traces to:** L2-045 AC2, AC3. L1-011.

## Status
Complete

Vertical slice: failed HTTP calls from the frontend are logged with correlation IDs and sanitized.

## Components

- Frontend `api/error-logging.interceptor.ts` — Angular `HttpInterceptor` that:
  - On 4xx/5xx: extracts request `method`, `url`, response `status`, response `correlationId` header, and a sanitized request/response body summary.
  - Calls `LogService.report({ level: 'http', ... })` (slice 61's endpoint).
- Sanitizer: same field deny-list as slice 61, plus URL query params `token`, `key` are masked to `***`.
- Backend `Logs/CreateLog.cs` (slice 61) rejects `stack` > 16 KB and truncates oversized `message` to 500 chars.

## Acceptance tests (L2-045)

- AC2: simulated `500` from `/api/contacts` produces a log entry with `level=http`, `status=500`, and the response correlation ID.
- AC3: a request body containing `{ password: 'pw' }` is logged with `password` removed.
- Oversized stack rejected with 400; oversized message truncated to 500 chars.

## Radical simplicity notes

- Reuses slice 61's endpoint and sanitizer. No new logging service.
- Interceptor only logs failures; success traffic is captured by backend request logs (slice 58).
