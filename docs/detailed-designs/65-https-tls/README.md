# 65 — Production HTTPS and TLS Enforcement

**Traces to:** L2-049. L1-014.

## Status
Complete

Vertical slice: production refuses plaintext HTTP and uses TLS 1.2/1.3 with an approved cipher allowlist.

## Components

- Backend `Program.cs` — in `Production`:
  - `app.UseHttpsRedirection()` redirects HTTP to HTTPS.
  - `app.UseHsts()` with one-year max-age and `includeSubDomains`.
  - Kestrel configured with `SslProtocols = Tls12 | Tls13` and the platform's default cipher allowlist (documented in `docs/security/tls-policy.md`).
- Reverse proxy / load balancer (Azure Front Door or App Gateway) terminates TLS; backend listener accepts HTTPS only.
- HTTP listener is disabled in production via `Kestrel:Endpoints` config.

## Acceptance tests (L2-049)

- Smoke test: `curl http://api.example.com/...` from outside the VNet returns a 30x to HTTPS or refuses connection.
- TLS scan (e.g., `testssl.sh`) reports only TLS 1.2/1.3, no insecure ciphers.
- HSTS header present on every HTTPS response.

## Radical simplicity notes

- Cipher selection is whatever the hosting platform's "secure default" provides; we document it but do not maintain a custom list.
- HTTP listener is removed, not redirected internally — there is no plaintext path in production.
