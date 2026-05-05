# 69 — CSRF Token Flow

**Traces to:** L2-054. L1-014.

## Status
Complete

Vertical slice: the SPA receives a CSRF token cookie and echoes it on every state-changing request.

## Components

- Backend `Program.cs` — `services.AddAntiforgery(o => { o.HeaderName = "X-CSRF-TOKEN"; o.Cookie.Name = "XSRF-TOKEN"; o.Cookie.SameSite = SameSiteMode.Strict; });`.
- Backend `CsrfController.GetToken` — `GET /api/csrf` writes the token to the cookie and returns `204`. SPA calls this once on app bootstrap.
- Backend global filter — every non-GET endpoint requires `[ValidateAntiForgeryToken]` (or its functional equivalent applied via convention so individual controllers don't repeat the attribute).
- Frontend `api/csrf.interceptor.ts` — reads `XSRF-TOKEN` cookie and adds `X-CSRF-TOKEN` header on every non-GET request.

## Acceptance tests (L2-054)

- `POST /api/contacts` without `X-CSRF-TOKEN` → 400 with `error: "csrf_required"`.
- `POST /api/contacts` with mismatched header → 400.
- All cookies are `SameSite=Strict; Secure; HttpOnly` where applicable (`XSRF-TOKEN` is not `HttpOnly` because the SPA must read it).

## Radical simplicity notes

- One built-in framework feature, two lines of config, one interceptor.
- No double-submit pattern beyond what AntiForgery already provides.
