# 59 — Backend Exception Handling and Error Counter

**Traces to:** L2-044 AC2. L1-011.

## Status
Complete

Vertical slice: any unhandled exception returns a generic 500, logs the stack with the correlation ID, and increments an error counter.

## Components

- Backend `Observability/ErrorMiddleware.cs` — `try/catch` around `next(ctx)`:
  ```csharp
  catch (Exception ex) {
    var corr = ctx.Items["CorrelationId"];
    log.LogError(ex, "Unhandled {CorrelationId}", corr);
    metrics.ErrorCount.Add(1, new("path", ctx.Request.Path));
    ctx.Response.StatusCode = 500;
    await ctx.Response.WriteAsJsonAsync(new { error = "internal_error", correlationId = corr });
  }
  ```
- Backend `Observability/Metrics.cs` — registers `Meter` with one `Counter<long> ErrorCount`, exported via OpenTelemetry to the platform metrics endpoint.
- Middleware order: `Correlation → Error → RequestLogging → MVC`.

## Acceptance tests (L2-044 AC2)

- An endpoint that throws → response is `500` with body `{ error, correlationId }` and no stack/PII leaked.
- A log entry exists with full stack trace and the same correlation ID.
- The error counter increments by exactly one per unhandled exception.

## Radical simplicity notes

- One middleware, one counter. No problem-details builder for now.
- Generic 500 body matches the rest of the API's error shape.
