# 67 — Request Validation and Body-Size Limits

**Traces to:** L2-051. L1-014.

## Status
Accepted

Vertical slice: every endpoint validates inputs through one validation pipeline and rejects oversized bodies with a consistent 400 contract.

## Components

- Backend `Validation/ValidationBehavior.cs` — MediatR pipeline behavior that runs `IValidator<TRequest>` (FluentValidation) before handlers. Throws `ValidationException` aggregating field errors.
- Backend `Validation/ValidationExceptionFilter.cs` — converts `ValidationException` to `400` with body:
  ```json
  { "error": "validation_failed", "fields": { "fieldName": ["message"] } }
  ```
- Backend `Program.cs` — `Kestrel.Limits.MaxRequestBodySize = 1 MB` (logs and dashboard endpoints have explicit overrides documented in their slices).
- Backend tests assert: every command/query has a registered `IValidator<>`, found by reflection.

## Acceptance tests (L2-051)

- Submitting a malformed payload returns the structured 400 contract.
- A 5 MB request to `/api/contacts` returns `413 Payload Too Large`.
- Reflection scan finds an `IValidator<>` for every command/query type.

## Radical simplicity notes

- One pipeline behavior + one exception filter is the entire validation contract.
- Per-endpoint validators stay close to their command in the same folder.
