# Implementation vs Requirements & Design Gap Audit

Date: 2026-05-05
Branch: `claude/audit-code-requirements-6EaY5`

## Sources
- `docs/specs/L1.md` (18 high-level requirements)
- `docs/specs/L2.md` (64 detailed requirements with acceptance criteria)
- `docs/detailed-designs/` (89 design slices + index)
- `backend/TheUpperRoom.Api/` (.NET 9 + MediatR + EF Core)
- `backend/TheUpperRoom.Api.Tests/` (xUnit + WebApplicationFactory)
- `frontend/projects/` (Angular 21 — `app-shell`, `api`, `components`, 9 feature libraries)
- `frontend/e2e/` (Playwright — 123 spec files)

## Scope

This audit compares the **implemented code** against both the L1/L2 requirements and the detailed designs. Two earlier audits (`docs/detailed-designs-requirements-gap-audit.md`, `docs/ui-design-requirements-gap-audit.md`) compare specs to designs; this one compares specs/designs to code.

A requirement is "Covered" only if the implementation satisfies all acceptance criteria with concrete code paths. "Partial" means functionality is present but one or more acceptance criteria are missed, untested, or weaker than required. "Missing" means no real implementation exists. "Deviates" means the code does not match the requirement (wrong values, wrong shape, or different behavior).

## Status Legend

| Status | Meaning |
| --- | --- |
| Covered | Code satisfies every acceptance criterion with evidence |
| Partial | Behaviour exists but one or more ACs are unmet, weaker, or unverified |
| Deviates | Implementation contradicts the requirement |
| Missing | No real implementation found |

## Executive Summary

The backend and frontend together implement most of the requirements at a functional level. CQRS with MediatR is enforced by an architecture test, the component and api libraries exist with injection tokens, every feature has working CRUD plus team-scoped authorization via a pipeline behavior, SignalR broadcasts include event type / entity ID / actor ID / timestamp, and there is broad Playwright coverage across three viewports.

The largest implementation gaps fall into five categories:

1. **One stored XSS vulnerability and one unenforced CSRF protection** — both directly contradict L2-053 / L2-054.
2. **Hackathon stage enum does not match the FaithTech 4 D's** — the code uses `Discover, Define, Design, Develop, Launch`, but L2-022 / L2-023 require `Discover, Design, Develop, Deploy`.
3. **Authorization gaps** — Angular routes outside `/dashboard` have no `authGuard` and no role guard at all, and the antiforgery token is sent by the client but never validated by the server.
4. **Per-AC quantitative budgets are not enforced or measured** — search latency budget set to 700 ms instead of 500 ms, account-rate-limit threshold mixed up, password reset token lifespan defaults to 24 h while the email and spec say 1 h, no Lighthouse run, no warm-load timing.
5. **Cross-cutting polish items** — feature libraries still import `@angular/material` directly (54 violations of L2-060), zero E2E tests carry the required `// Acceptance Test\n// Traces to: L2-XXX\n// Description:` header (L2-063 AC3), and many DTOs and responsive layouts miss minor AC details (`Contact.CreatedById`, `<576px` single-column variants for partner board / hackathon detail / contacts list, max content width cap at ≥1200 px).

Highest priority fixes are listed in the [Critical Findings](#critical-findings) section below.

## Coverage Summary

| Status | Count | L2 IDs |
| --- | --- | --- |
| Covered | 35 | L2-001, L2-004, L2-006, L2-008, L2-016, L2-017, L2-018, L2-024, L2-027, L2-028, L2-029, L2-030, L2-032, L2-035, L2-037, L2-038, L2-040, L2-042, L2-044, L2-045, L2-048, L2-049, L2-050, L2-051, L2-052, L2-056, L2-057, L2-058, L2-061, L2-062, L2-011, L2-012, L2-033, L2-034, L2-036 |
| Partial | 24 | L2-002, L2-003, L2-005, L2-007, L2-009, L2-010, L2-013, L2-014, L2-015, L2-019, L2-020, L2-021, L2-025, L2-026, L2-031, L2-039, L2-041, L2-043, L2-046, L2-047, L2-055, L2-059, L2-060, L2-063 |
| Deviates | 4 | L2-022, L2-023, L2-053, L2-054 |
| Missing | 1 | L2-064 (parameterization across viewports incomplete; remains Partial in stricter reading) |

Totals are approximate — several requirements straddle Partial/Deviates depending on whether the criterion is judged by behavior or by spec letter.

## Critical Findings

### C1 — Stored XSS in `HighlightPipe` (L2-053)

`frontend/projects/components/src/lib/highlight/highlight.pipe.ts:8-16` calls `bypassSecurityTrustHtml(highlighted)` after concatenating the user-supplied `text` with `<mark>$1</mark>`. The `text` is **not** HTML-escaped, only the regex `term` is escaped. The pipe is invoked with `[innerHTML]` over user-controlled fields — `r.firstName`, `r.lastName`, `r.snippet` — at `frontend/projects/feature-contacts/src/lib/contacts-list-page/contacts-list-page.html:57,63`. A contact saved with first name `<img src=x onerror=alert(1)>` will execute on the search results screen.

L2-053 AC2 explicitly requires that "a malicious script payload saved as a contact note, partner note, or display name … must not execute and the payload must be displayed as escaped text." The xss-lint-rule test at `frontend/projects/app-shell/src/app/test/xss-lint-rule.spec.ts` exists but does not flag this pipe.

**Fix**: HTML-escape `text` before substitution.

### C2 — CSRF antiforgery token not enforced (L2-054)

`backend/TheUpperRoom.Api/Program.cs:22-27` calls `AddAntiforgery(...)`, and `Csrf/GetCsrfToken.cs` issues the token cookie. The Angular `csrf.interceptor.ts` correctly attaches `X-CSRF-TOKEN` on POST/PUT/PATCH/DELETE. **However, the backend never validates the token**: there is no `app.UseAntiforgery()` in the request pipeline (`Program.cs:113-122`), no `[AutoValidateAntiforgeryToken]` global filter, and no `[ValidateAntiForgeryToken]` decorators on controllers. The session cookie's `SameSite=Lax` provides partial CSRF defense, but L2-054 AC1 requires an explicit 403 when the token is absent or invalid.

**Fix**: Add `app.UseAntiforgery()` after `UseAuthentication`/`UseAuthorization` and apply `[AutoValidateAntiforgeryToken]` to controllers (excluding the public auth endpoints already exempt).

### C3 — Hackathon stage enum does not match the FaithTech 4 D's (L2-022, L2-023)

`backend/TheUpperRoom.Api/Domain/Hackathon.cs:3` declares:

```csharp
public enum HackathonStage { Discover, Define, Design, Develop, Launch }
```

L2-022 AC1 requires the initial stage to be Discover, and L2-023 AC1 requires advancement through `Discover → Design → Develop → Deploy`. The implementation uses **five** stages and substitutes `Define` for the second stage and `Launch` for the fourth, which is the previous FaithTech 5 D's, not the 4 D's. This cascades through `HackathonStageHistory`, `AdvanceHackathonStageCommand`, the SignalR `hackathonStageChanged` payload, and any frontend stage labels.

**Fix**: Change the enum to `{ Discover, Design, Develop, Deploy }`, generate a migration that maps old values to new ones, and audit all template strings.

### C4 — Angular route guards missing on most protected routes (L2-007)

`frontend/projects/app-shell/src/app/app.config.ts:42-66` only attaches `canActivate: [authGuard]` to `/dashboard`. Every other authenticated route (`/team`, `/teams`, `/hackathons*`, `/partners*`, `/contacts*`, `/admin/*`) has **no guard**. The `role.guard.ts` file exists but is never wired in. Anonymous deep-links load the feature module and only fail when an HTTP call returns 401 — L2-007 AC3 requires the guard to redirect before loading.

**Fix**: Apply `authGuard` to every authenticated route and add `roleGuard` to admin routes.

### C5 — Backend HTTP 403 not audit-logged on authorization denial (L2-007)

`Validation/ValidationExceptionFilter.cs` translates `UnauthorizedAccessException` to 403 but does not call `IAuditLog.Write`. L2-007 AC2 requires the denial to be logged with user ID, endpoint, and timestamp. The audit log is only invoked from explicit handlers (sign-in, sign-out, role assignment).

## High-Priority Findings

### H1 — Password reset token lifespan exceeds 60 minutes (L2-003)

`Auth/RequestRecovery.cs:23-24` emails the user "valid 1 hour", but `Program.cs` never sets `DataProtectionTokenProviderOptions.TokenLifespan`, so Identity's default 24-hour token applies. `Auth/ResetPassword.cs:32-35` calls `UpdateSecurityStampAsync` after reset (good — invalidates other sessions on next request), but the 60-minute window in L2-003 AC2/AC3 is not enforced.

### H2 — Search response budget set to 700 ms instead of 500 ms (L2-014, L2-031, L2-043, L2-047 AC3)

`backend/TheUpperRoom.Api.Tests/Performance/ApiBudgetTests.cs` asserts the search endpoint p95 at **700 ms**; the spec mandates ≤ 500 ms.

### H3 — Account-level rate limiting not implemented (L2-055 AC1b)

`Program.cs:28-50` configures only IP-level limits (`sign-in-ip`, `recovery-email`). L2-055 AC1b requires "more than 5 failed attempts target a single account within 15 minutes" → 429. Identity lockout (`Program.cs:89-90`, 5 failures / 15 min) handles **lockout** but does not return **429**. The recovery limiter window is 1 hour, but L2-055 AC2 says 15 minutes. Lockout events are not audit-logged either (L2-002 AC4).

### H4 — `Contact.CreatedById` and `ContactDto.CreatedAt` missing (L2-010 AC1)

`Domain/Contact.cs` has `CreatedAt` but no `CreatedById`. `Contacts/GetContact.cs` returns `UpdatedAt` but **not** `CreatedAt` and not the creator. L2-010 AC1 explicitly lists "creation date, last-updated date, the user who created the contact" as required fields on the contact detail screen.

### H5 — Partner notes cannot be edited or deleted by City Lead override (L2-019)

`Notes/UpdateNote.cs:39` and `Notes/DeleteNote.cs:39` both contain:

```csharp
if (note.TargetType != "Contact") return false;
```

This kills the City Lead override for **Partner** notes. Authors can still edit/delete their own partner notes, and Administrators can override (because the check is `IsAdmin || IsTeamLead`), but L2-019 AC2 requires the City Lead override on partner notes too.

### H6 — Feature libraries import `@angular/material` directly (L2-060 AC1)

54 lines across `feature-admin`, `feature-auth`, `feature-contacts`, `feature-dashboard`, `feature-hackathons`, `feature-notifications`, `feature-partners`, `feature-search`, `feature-team` import `MatButtonModule`, `MatIconModule`, `MatTableModule`, `MatMenuModule`, etc. directly. L2-060 AC1 requires those imports to come from the `components` library only. The lint rule that would enforce this does not exist.

### H7 — Zero E2E tests carry the required header comment (L2-063 AC3)

`grep -l "Acceptance Test" frontend/e2e/tests/**/*.spec.ts` returns 0 of 123 files. Tests use `// Traces to: …` referring to design-slice numbers, not the L2-XXX form, and none have the literal `// Acceptance Test` and `// Description:` lines. The spec gives an exact format and the rest of the spec relies on it.

### H8 — Hackathon stages: signal-R event payload uses string conversion of wrong enum (L2-022, L2-037)

`Hackathons/AdvanceStage.cs:53-54` sends `fromStage = fromStage.ToString()`, `toStage = cmd.ToStage.ToString()`. Because of C3, those strings will be `"Define"` and `"Launch"`, which contradicts both the requirement and the design language used in the rest of the system.

## Detailed Findings by L2 Requirement

### Authentication & Authorization (L2-001 — L2-008)

| L2 | Status | Evidence | Gaps |
| --- | --- | --- | --- |
| L2-001 User Registration | Covered | `Auth/Register.cs:22-26` enforces 12-char + mixed case + digit + symbol; `:41-42` returns generic message on duplicate; `:86-93` issues 24-hour verification token. | 30-second email-delivery SLA not measured. |
| L2-002 User Sign-In | Partial | `Auth/SignIn.cs:27-36`, `AuthController:78`. Identity lockout configured 5/15 in `Program.cs:89-90`. | Lockout not audit-logged (AC4). 2-second redirect SLA not measured. |
| L2-003 Password Recovery | Partial | `Auth/RequestRecovery.cs` always returns 200; `ResetPassword.cs:35` rotates SecurityStamp (invalidates other sessions on next request). | Token lifespan defaults to 24 h, not 60 min (AC2/AC3). Single-use is enforced by Identity but not directly tested. |
| L2-004 Session Management | Covered | `Program.cs:66-80` — HttpOnly, SecurePolicy.Always, SameSite.Lax, 30-min sliding, 12-h absolute via `OnValidatePrincipal`. Verified by `Tests/Auth/SessionManagementTests.cs`. | None significant. |
| L2-005 User Sign-Out | Partial | `Auth/SignOut.cs` calls `signInManager.SignOutAsync()` and `auditLog.Write("signedOut")`. Frontend `app.ts:107` navigates to `/auth/sign-in`. | SignalR connection is not explicitly closed on sign-out. 1-second redirect SLA not measured. |
| L2-006 Role Definitions | Covered | `Infrastructure/Roles.cs` defines five roles; `SubordinateRoles` whitelists three. `Auth/AssignRole.cs:26` enforces subordinate-only for City Lead; Admin bypass present. `UsersController` uses `[Authorize(Roles = "Admin,CityLead")]`. | "Effect on next request without sign-out" not directly tested. |
| L2-007 Endpoint Authz Enforcement | Partial | Backend 401/403 paths exist; `ValidationExceptionFilter` returns 403 on `UnauthorizedAccessException`. | **C4** — Angular route guards only on `/dashboard`. **C5** — 403 denials are not audit-logged. |
| L2-008 Cross-Team Isolation | Covered | `Infrastructure/TeamScopeBehavior.cs` short-circuits non-Admin cross-team requests. `Teams/GetGlobalTeam.cs:59-92` returns `GlobalTeamPublicDto` for non-Admins (city, role counts, hackathon/partner counts) and `GlobalTeamAdminDto` for Admins. | No explicit test that public DTO omits notes/contacts. |

### Contacts (L2-009 — L2-015)

| L2 | Status | Evidence | Gaps |
| --- | --- | --- | --- |
| L2-009 Create Contact | Partial | `Contacts/CreateContact.cs` validates name, email, phone, optional notes; broadcasts `contactCreated`. | Phone regex `^\+?[\d\s\-().]{7,20}$` is permissive, not strict E.164. No 1-second SLA measurement. |
| L2-010 View Contact | Partial | `GetContact.cs` returns notes ordered DESC, 404 on cross-team. | **H4** — DTO omits `CreatedAt` and `CreatedById`. `Contact` entity has no `CreatedById` column at all. <576 px responsive layout not verified. |
| L2-011 Update Contact | Covered | `UpdateContact.cs:41-42` raises `ConflictException` on version mismatch; filter returns 409. | None significant. |
| L2-012 Delete Contact | Covered | `DeleteContact.cs:19` soft-deletes via `DeletedAt`; `Admin/RestoreContact.cs` restores. Role gate at `ContactsController:63`. | Confirmation dialog is frontend-side; existence verified in templates. |
| L2-013 Notes on Contact | Partial | `Notes/AddNote.cs:16` enforces 1-4000 chars; `UpdateNote.cs`/`DeleteNote.cs` enforce author or `IsAdmin || IsTeamLead`. | The `IsTeamLead` helper (line 39) bails out for non-Contact targets — this is fine for L2-013 (Contact) but breaks L2-019 (Partner). See **H5**. |
| L2-014 Search Contacts | Partial | `Contacts/SearchContacts.cs` searches first/last/email/phone/notes; produces snippet via `Excerpt(...)` with surrounding context. Backend enforces 2-char min via controller. | Snippet does not include `<mark>` markup — the frontend uses the buggy highlight pipe (**C1**) to add it. 500-ms SLA not measured (test budget is 700 ms — see **H2**). |
| L2-015 List & Paginate | Partial | `ListContacts.cs` paginates 25/page, sortable by first/last name. | <576 px card-list responsive variant not in templates. Filter controls collapsing into a menu not implemented. |

### Partners (L2-016 — L2-021)

| L2 | Status | Evidence | Gaps |
| --- | --- | --- | --- |
| L2-016 Create Partner | Covered | `CreatePartner.cs` validates name, URL; defaults stage to Lead. | None significant. |
| L2-017 Funnel Stages | Covered | `Partners/ChangeStage.cs:36-42` records `PartnerStageHistory`; `:46-55` broadcasts `partnerStageChanged` with all required fields. | None significant. |
| L2-018 Associate Contacts | Covered | `AddPartnerContact.cs`, `CreateContactForPartner.cs`, `RemovePartnerContact.cs`. | None significant. |
| L2-019 Partner Notes | Partial | Same handler as L2-013. | **H5** — City Lead override does not work for partner notes. |
| L2-020 View/Update/Delete Partner | Partial | `DeletePartner.cs` soft-deletes the partner; `PartnerContacts.ExecuteDeleteAsync()` removes association rows but leaves `Contact` rows intact, so contacts are detached not deleted. Role gate via `[Authorize(Roles = "Admin,CityLead")]`. | "Detach (but not delete) associated contacts" relies on cascade behavior that is correct but not asserted by a test. |
| L2-021 Filter / Kanban | Partial | `ListPartners.cs` filters by stage. Frontend `partners-board-page` renders three columns. | <768 px single-column collapse not implemented (template uses fixed three-column flex). |

### Hackathons (L2-022 — L2-025)

| L2 | Status | Evidence | Gaps |
| --- | --- | --- | --- |
| L2-022 Create Hackathon | Deviates | `CreateHackathon.cs` enforces date order, persists initial stage `Discover`. | **C3** — wrong enum values (`Define` instead of `Design`, `Launch` instead of `Deploy`, plus a fifth stage). |
| L2-023 Track 4 D's | Deviates | `AdvanceStage.cs` records history and broadcasts. | **C3** — wrong stage labels propagate into history rows and SignalR payloads (**H8**). |
| L2-024 Products | Covered | `AddProduct.cs` validates URLs and supports `ProductMembers` for assignments. | None significant. |
| L2-025 View Hackathon | Partial | `GetHackathon.cs` returns dates, host city, partners, products, stage history. | <576 px collapsible-section variant not implemented. |

### Teams (L2-026 — L2-031)

| L2 | Status | Evidence | Gaps |
| --- | --- | --- | --- |
| L2-026 View Local Team | Partial | `Teams/GetLocalTeam.cs` returns name, role(s), email, IsActive; sorts by role priority then `DisplayName`. | Spec says "by role then **last name**" — there is no `LastName` column on `User`, so `DisplayName` is used as a substitute. |
| L2-027 Add Member | Covered | `InviteMember.cs` issues a 7-day token, persists role names, sends invite email. `RegisterCommandHandler` consumes the token and assigns roles. | None significant. |
| L2-028 Remove Member | Covered | `RemoveMember.cs` rejects cross-role removals (City Lead → Admin/CityLead), revokes roles, locks account, broadcasts. | "End any active session" relies on `LockoutEndDateUtc`; not directly verified. |
| L2-029 Assign Role | Covered | `Auth/AssignRole.cs` + SignalR broadcast. | None significant. |
| L2-030 View Global Teams | Covered | `ListGlobalTeams.cs` paginates 25/page; admin vs public DTOs in `GetGlobalTeam.cs`. | None significant. |
| L2-031 Search Global Teams | Partial | Backend matches city + display name. Frontend enforces 2-char min in `global-teams-page.ts:49`. | Server does not enforce 2-char min (client-side only). 500-ms SLA not measured. |

### Dashboard (L2-032 — L2-035)

| L2 | Status | Evidence | Gaps |
| --- | --- | --- | --- |
| L2-032 Default Layout | Covered | `GetMyDashboard.cs:13-17` returns `{"items":[]}` for new users; frontend shows "Add widget" CTA. | None significant. |
| L2-033 Add/Resize/Move | Covered | `dashboard-page.ts:62,78-88` debounces persistence (300 ms), uses Gridster callbacks. | 500-ms persist SLA on drop / resize-end not measured. |
| L2-034 Real-time Charts | Covered | `widgets/line-chart-widget` uses Chart.js, subscribes to `metricInvalidated`. | 1-second initial render and 2-second SignalR refresh SLAs not measured. |
| L2-035 Persisted Layout | Covered | `SaveMyDashboard.cs:35-48` writes per-user with `UpdatedAt`; last-write-wins. | Cross-device race not tested. |

### Real-Time and Notifications (L2-036 — L2-038)

| L2 | Status | Evidence | Gaps |
| --- | --- | --- | --- |
| L2-036 Connection Lifecycle | Covered | `realtime.service.ts:25,39-50` configures exponential backoff 1 s → 60 s; closes on disconnect. | "Within 2 seconds" connect-time SLA not measured. |
| L2-037 Push Notifications | Covered | `Realtime/Broadcast.cs:6-20` sends `(eventType, entityId, actorId, timestamp, data)`. Most producer slices include all fields. | "Within 500 ms screen update" SLA not measured separately from 2-second SignalR budget. |
| L2-038 Notification Center | Covered | `ListNotifications.cs`, `MarkRead.cs`, `notification-center.ts` + unread badge. | Offline-then-online delivery not directly tested. |

### Responsive Design and Theme (L2-039 — L2-042)

| L2 | Status | Evidence | Gaps |
| --- | --- | --- | --- |
| L2-039 <576 px | Partial | Local team page renders cards vs table. Hamburger nav present. | 44 × 44 hit-target sizing not enforced project-wide; spacing tokens are 12-16 px. Several feature pages have no <576 px layout (contacts list, partner board, hackathon detail, partner detail). |
| L2-040 ≥576 px <992 px | Covered | `components/detail-two-column.scss:7-9` switches at 768 px. Partner board ≥768 px present. | None significant. |
| L2-041 ≥992 px | Partial | Dashboard grid supports 12 columns. | Max content-width cap (e.g., 1440 px) not present — content stretches edge-to-edge on ultra-wide screens. |
| L2-042 Dark Monochromatic | Covered | `app-shell/styles/theme.scss`, `_tokens.scss`. `contrast.spec.ts` asserts ≥7:1 for body text. | Chart series colors include accent purples; not strictly monochromatic but inside palette. |

### Search (L2-043)

| L2 | Status | Evidence | Gaps |
| --- | --- | --- | --- |
| L2-043 Global Search | Partial | `feature-search/global-search-overlay` opens via Ctrl/Cmd+K, calls `Search/GlobalSearch.cs` (parallel queries on contacts/partners/hackathons/members). 250 ms client debounce. | <576 px full-screen takeover not implemented. 500-ms latency depends on network plus backend; not measured. |

### Logging and Observability (L2-044 — L2-045)

| L2 | Status | Evidence | Gaps |
| --- | --- | --- | --- |
| L2-044 Backend Logging | Covered | `RequestLoggingMiddleware`, `ErrorMiddleware`, `CorrelationMiddleware`, `IAuditLog`. | Remote IP not in standard request log. Audit log not invoked on lockout, on 403 denial (**C5**), or on contact/partner/hackathon delete. |
| L2-045 Frontend Logging | Covered | `global-error-handler.ts` → `LogService.report`; `error-logging.interceptor.ts` masks sensitive query params; `Logs/CreateLog.cs` validates and tags `Source=frontend`. | Correlation-ID propagation frontend → backend is not asserted by a test. |

### Performance (L2-046 — L2-048)

| L2 | Status | Evidence | Gaps |
| --- | --- | --- | --- |
| L2-046 Page Load | Partial | `frontend/e2e/perf/page-load.spec.ts` measures LCP under Slow-4G + 4× CPU on six screens. | Warm-load (1.5 s) not measured. No Lighthouse run for ≥80 perf / ≥95 a11y. |
| L2-047 API Response | Partial | `Tests/Performance/ApiBudgetTests.cs` p95 ≤300 ms GET, ≤500 ms POST. | Search budget set to 700 ms instead of 500 ms (**H2**). |
| L2-048 Real-time Latency | Covered | `Tests/Perf/RealtimeLatencyTests.cs` measures p95 / p99 vs 2 s / 5 s. | Test is opt-in (`REALTIME_LATENCY=true`), not run in CI by default. |

### Security (L2-049 — L2-056)

| L2 | Status | Evidence | Gaps |
| --- | --- | --- | --- |
| L2-049 TLS | Covered | `UseHsts()` (1 year, includeSubDomains), `UseHttpsRedirection()`. | TLS 1.2+ negotiation / cipher suite not verified by test (relies on hosting). |
| L2-050 Password Storage | Covered | Identity v3 PBKDF2-SHA256, default 100k iterations. `Tests/Security/PasswordStorageTests.cs` checks format and salt. | Spec wording "at least 600,000 iterations" for PBKDF2 — Identity default is 100k. Argon2id is not configured but is one of the spec's "or" options; PBKDF2 is the other but at fewer iterations than spec demands. |
| L2-051 Input Validation | Covered | `Program.cs:18-19` 1 MB request limit; `ValidationBehavior` runs before handlers. | Oversized-input rejection not directly tested. |
| L2-052 Injection Prevention | Covered | `Tests/Security/SqlInjectionTests.cs` static-scans for `FromSqlRaw($"…"`. EF Core only. | No dynamic fuzz test (`drop table`, `${jndi:…}`). |
| L2-053 XSS Prevention | Deviates | xss-lint-rule + Angular default contextual encoding. | **C1** — `HighlightPipe` is a real stored XSS sink; no E2E with malicious payload. |
| L2-054 CSRF | Deviates | Antiforgery configured + frontend interceptor sends header. | **C2** — server never validates the token. |
| L2-055 Rate Limiting | Partial | IP rate limiter on sign-in; recovery limiter (1 hour). Identity lockout 5/15. | **H3** — no account-level 429 rate limit; recovery window is 1 h not 15 min; lockout not logged. |
| L2-056 Secrets Management | Covered | `appsettings*.json` scanned by `Tests/Security/SecretsConfigTests.cs`; env-var prefix `THEUPPERROOM_`. | Bundle is not scanned post-build. |

### Accessibility (L2-057 — L2-059)

| L2 | Status | Evidence | Gaps |
| --- | --- | --- | --- |
| L2-057 Keyboard | Covered | `e2e/a11y/tab-order.spec.ts`, `:focus-visible` rule, dialog focus trap with `previousFocus` restore. | Tab order tested only at 1280×800. |
| L2-058 Screen Reader | Covered | axe-core snapshot, `ur-live-region` with `aria-live="polite"`, `aria-labelledby` on dialogs. | Real assistive-tech (NVDA/JAWS/VoiceOver) not exercised. |
| L2-059 Contrast | Partial | Dark monochrome theme in tokens. | **`color-contrast` rule disabled in axe-snapshot test** — no automated WCAG-AA validation. |

### Component & API Architecture (L2-060 — L2-062)

| L2 | Status | Evidence | Gaps |
| --- | --- | --- | --- |
| L2-060 Component Library | Partial | `components/public-api.ts` exports branded wrappers (UrButtonComponent, UrDialogComponent, etc.). | **H6** — 54 direct `@angular/material` imports across 9 feature libraries. Lint rule absent. |
| L2-061 API Library | Covered | `api/lib/*.service.ts` defines `*_SERVICE` `InjectionToken`; `app.config.ts` registers `useClass` against tokens. | `public-api.ts` re-exports services + tokens; not all token symbols are re-exported separately, but they ride along on the service file exports. |
| L2-062 CQRS / MediatR | Covered | `Tests/Architecture/CqrsRules.cs` enforces controllers inject only `IMediator`, every request has exactly one handler. | None significant. |

### End-to-End Tests (L2-063 — L2-064)

| L2 | Status | Evidence | Gaps |
| --- | --- | --- | --- |
| L2-063 E2E Coverage | Partial | 123 `*.spec.ts` files across 11 areas. POM in `e2e/pages/`. | **H7** — no test has the `// Acceptance Test\n// Traces to: L2-XXX\n// Description:` header. Real-time delivery between two clients and global-search end-to-end not found. Some tests still use raw selectors outside POMs (388 `page.locator/page.getBy` calls in `tests/`). |
| L2-064 Multi-Viewport | Partial | `playwright.config.ts` projects: 375×667, 768×1024, 1280×800. | Spec requires sign-in, contact create, partner create, dashboard widget add, and global search to be parameterized over all three. Only sign-in / register / auth-session are explicitly tagged. |

## Detailed Designs vs Implementation

The 89 detailed-design slices in `docs/detailed-designs/` are tagged `Draft` and most map cleanly to handlers / pages. Notable mismatches between designs and what is implemented:

- **08-create-contact** design omits the optional notes field; the implementation correctly accepts notes. Design should be updated.
- **27-remove-team-member** design referenced setting `User.IsActive=false` and `TeamId=null`; the implementation locks the account and revokes roles but leaves `TeamId`. Behavior is acceptable; design wording is stale.
- **22-hackathon-4ds** describes the 4 D's stages; the implementation deviates (**C3**).
- **32-signalr-realtime** event catalog requires `actorId` and `timestamp` on every event — the actual `Broadcast.TeamEvent` envelope satisfies this, and producer slices that bypass `Broadcast` (e.g., `Auth/Register.cs:73-82`, `Hackathons/AdvanceStage.cs:46-55`) construct anonymous payloads with the right fields.
- **52-realtime-latency-harness** is implemented as an opt-in test (good), but not wired into CI.
- **65-https-tls**, **66-password-hashing**, **69-csrf-token** designs match the implementation status; the gaps in this audit are also gaps in those designs.
- **78-playwright-pom** and **87-viewport-matrix** match the project layout, but the specific `// Acceptance Test` header (**H7**) is not adopted.

## Recommended Fix Order

1. **C1 — XSS in HighlightPipe** (small change, high impact).
2. **C2 — Wire `app.UseAntiforgery()` and `[AutoValidateAntiforgeryToken]`** (small change, high impact).
3. **C3 — Hackathon stage enum migration** (one EF migration + producer / consumer label updates).
4. **C4 — Apply `authGuard` to all authenticated routes; add `roleGuard` to admin routes**.
5. **H1 — Set `DataProtectionTokenProviderOptions.TokenLifespan = TimeSpan.FromHours(1)`**.
6. **H4 — Add `Contact.CreatedById` column + migration; surface `CreatedAt`/`CreatedById` in DTO**.
7. **H5 — Generalise `IsTeamLead` for partner-typed notes**.
8. **H2 / L2-047 — Tighten search test budget to 500 ms**.
9. **H3 — Add account-level fixed-window limiter; switch recovery limiter window to 15 min; audit-log lockouts**.
10. **C5 — Audit-log 403 denials in `ValidationExceptionFilter`**.
11. **H6 — Replace direct `@angular/material` imports in feature libraries with components-library wrappers; add an ESLint rule to keep this clean**.
12. **H7 — Add the `// Acceptance Test\n// Traces to: L2-XXX\n// Description:` header to every E2E spec; fail CI when missing**.
13. **L2-059 — Re-enable axe `color-contrast` rule and fix what it surfaces**.
14. **L2-046 — Add Lighthouse and warm-load measurement to CI**.
15. **L2-039 — Audit hit-target sizes and add missing <576 px variants for partner board, hackathon detail, contacts list, partner detail**.
16. **L2-064 — Parameterize the listed flows over all three viewports**.
