# 68 — Injection and Stored-XSS Hardening Checks

**Traces to:** L2-052, L2-053. L1-014.

Vertical slice: combine input/output abuse checks into one verification suite.

## Components

- Backend tests `tests/security/sql-injection.spec.cs` — sends `' OR 1=1 --`, `; DROP TABLE`, and Unicode confusables to every search endpoint; asserts results are empty/unchanged and DB is intact.
- Backend tests `tests/security/stored-xss.spec.cs` — creates a contact with `<img src=x onerror=alert(1)>` in name, notes, and display name; fetches via API and via `/contacts/{id}` page render; asserts:
  - API response returns the literal string (no server-side mutation).
  - Browser DOM contains escaped text node, not a live `<img>` element.
- Frontend lint rule rejects `[innerHTML]`, `bypassSecurityTrustHtml`, and `DomSanitizer.bypassSecurityTrust*` outside an allow-listed path.
- Static scanner: `dotnet sql-injection-analyzers` (or Roslyn analyzers covering raw SQL); fails the build on any direct concatenation into `FromSqlRaw`.

## Acceptance tests

- L2-052: SQL/NoSQL injection payloads return safe empty results; static scan finds zero raw SQL concatenations.
- L2-053: stored XSS payloads render as inert text; lint scan finds zero unsafe Angular sinks outside the allow-list.

## Radical simplicity notes

- We use EF Core parameterized queries everywhere already; the static scan is a guard, not a transformation.
- Angular's default text binding is safe by default — the lint rule keeps it that way.
