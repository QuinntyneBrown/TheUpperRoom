# 38 - Data Protection and Application Security ✅ Complete

**Traces to:** L2-049 through L2-056 (L1-014).

This cross-cutting design turns security requirements into implementation checks.

## Components

- Backend `Infrastructure/HttpsOptions` - production enforces HTTPS redirect or refuses non-TLS requests.
- Backend TLS configuration - documented allowlist for TLS 1.2/1.3 strong cipher suites at hosting edge.
- Backend `Infrastructure/IdentityConfig.cs` - Argon2id password hasher with documented memory, iterations, parallelism, and per-user salt. If unavailable, PBKDF2-SHA256 uses at least 600,000 iterations.
- Backend `ValidationBehavior` - FluentValidation before handler/database access.
- Backend request-size limits - global body cap plus stricter note/display-name limits before model binding where possible.
- Backend EF Core policy - parameterized EF only; any raw SQL must be parameterized and justified in code review.
- Backend anti-forgery - SameSite=Lax session cookie plus anti-CSRF token endpoint and `X-CSRF-TOKEN` header check on state-changing endpoints.
- Backend rate limiting - IP and email/account policies for `/api/auth/*`, including audit logs for throttles.
- Build `secret-scan` - checks source, appsettings, and production frontend bundle for secrets.

## Acceptance Tests

- L2-049: production non-TLS requests redirect/refuse; TLS negotiation accepts only TLS 1.2/1.3 and documented cipher suites.
- L2-050: password registration/change stores salted Argon2id or compliant PBKDF2 hashes; database/log inspection finds no plaintext or fast hashes.
- L2-051: every endpoint has validator coverage; invalid input returns structured 400 before business logic; oversized note/display-name requests are rejected early.
- L2-052: static analysis rejects user-input string concatenation in SQL/NoSQL/shell queries; fuzzing common injection payloads never exposes database errors or executes payloads.
- L2-053: code review check rejects `bypassSecurityTrust*` on untrusted input; stored XSS payloads render as escaped text in notes/display names.
- L2-054: state-changing requests missing CSRF token or from cross-site referer return 403.
- L2-055: sign-in and recovery rate limits return expected status/generic copy and emit audit logs.
- L2-056: secret scan passes on source and production frontend bundle; runtime secrets load only from environment or secret store.

## Radical Simplicity Notes

- Security is enforced centrally where possible: middleware, filters, validation pipeline, and build checks.
- `appsettings.Development.json` may contain non-secret local defaults only. Production secrets never live in checked-in config files.
