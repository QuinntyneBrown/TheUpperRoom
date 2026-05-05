# 70 — Sensitive Endpoint Rate Limiting

**Traces to:** L2-055. L1-014.

Vertical slice: sign-in, password recovery, and account lockout endpoints are rate-limited; throttled requests audit-log.

## Components

- Backend `Program.cs` — `services.AddRateLimiter(o => { ... })` with three named policies:
  - `sign-in-ip`: 10 requests / minute / IP.
  - `sign-in-account`: 5 failed attempts / 15 minutes / username (failed-attempt counter, not blanket request count).
  - `recovery-email`: 3 requests / hour / email.
- Endpoints attribute their policy: `[EnableRateLimiting("sign-in-ip")]` etc.
- On 429 → response body `{ error: "too_many_requests", retryAfterSeconds }` and `Retry-After` header.
- Audit hook (slice 60): every 429 emits `rateLimited` with `policy`, `subject`, `actorId`.
- Account lockout: after 10 cumulative failed sign-ins per account, lock for 30 minutes (Identity built-in `LockoutOptions`); audit `accountLockedOut`.

## Acceptance tests (L2-055)

- 11th sign-in attempt from one IP within a minute → 429 with `Retry-After`.
- 6th failed attempt against one account within 15 minutes → 429 + `accountLockedOut` audit at the 10th failure.
- 4th recovery request for one email within an hour → 429.
- Generic error message; no enumeration about whether the user exists.

## Radical simplicity notes

- Built-in `RateLimiter` middleware. No Redis, no custom token bucket.
- Three policies cover all sensitive endpoints currently in scope; new endpoints opt in by attribute only.
