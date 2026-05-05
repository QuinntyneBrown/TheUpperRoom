# 71 — Secrets Scanning and Runtime Configuration

**Traces to:** L2-056. L1-014.

## Status
Complete

Vertical slice: secrets never enter source or the production frontend bundle; runtime values come from environment variables or the platform secrets store.

## Components

- Source scan: pre-commit hook + CI step running `gitleaks` against the repo. Fails if any rule matches.
- Bundle scan: CI step runs the production frontend build, then greps the output for secret-shaped values (long base64, JWT, AWS-key prefixes). Fails on match.
- Allow-listed config files: only `appsettings.json` (non-secret defaults) and `appsettings.Development.json`. `.gitignore` rejects `appsettings.Production.json` and `.env*`.
- Backend `Program.cs` reads sensitive config (`ConnectionStrings:Default`, `Jwt:Signing`, `Smtp:Password`) only via `IConfiguration` bound to environment variables prefixed `THEUPPERROOM_`. Local dev uses .NET user-secrets.
- Production: secrets injected as environment variables from Azure Key Vault references.

## Acceptance tests (L2-056)

- `gitleaks` returns clean on every PR.
- Frontend bundle scan finds zero secret-shaped strings.
- Backend boot fails with a clear message when a required secret is missing — never falls back to a hardcoded value.

## Radical simplicity notes

- Use `gitleaks` with the default ruleset; no custom regex set yet.
- One config provider chain: env → user-secrets → appsettings. No bespoke loader.
