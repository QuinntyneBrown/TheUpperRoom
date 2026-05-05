# Missing Detailed Designs

## Basis

The current detailed-design index traces every L2 requirement, but several requirements are still represented only inside broad cross-cutting designs, bundled designs, or implicit supporting flows. This document treats a design as missing when it is not yet described as a small vertical slice that can be implemented and acceptance-tested in a limited context.

Each proposed design should be authored as a small folder under `docs/detailed-designs/` with a `README.md` and diagrams only where they clarify the workflow. Each design should include the frontend, API, backend, data, and acceptance-test scope needed to deliver one independently testable behavior.

## Functional Product Slices

| Proposed detailed design | Requirement traces | Scope | Description |
| --- | --- | --- | --- |
| Contact audit and restore view | L2-012 | Administrator-only audit page, deleted-contact query, restore command, route guard, and restore acceptance tests. | The current contact delete design mentions restore behavior, but the audit/restore UI is not a standalone vertical slice. This design keeps restore small and testable without expanding normal contact deletion. |
| Partner list stage filtering | L2-021, L2-046 | Partner list endpoint/page with stage filter chips, mobile card list, and filtered results. Excludes Kanban drag/drop. | The partner board design currently carries both list filtering and board layout. This slice isolates the list/filter acceptance criteria and gives the performance suite a concrete partner-list primary screen. |
| Hackathon list and navigation | L2-025, L2-046, L2-063 | Team-scoped hackathon list with title, dates, host city, current stage, mobile cards, and navigation to detail. | Several requirements and E2E flows assume a hackathon list, but the current set jumps from create to detail. This slice supplies the missing route and primary screen. |
| Update hackathon details | L2-063, supports L2-022/L2-025 | Edit title, start/end date, host city, and partner associations with validation and team scoping. | L2-063 requires hackathon CRUD coverage, while current designs cover create/detail/stage/products. This slice adds the update part without mixing it into create or detail. |
| Delete and restore hackathon | L2-063, L2-008, L2-044 | Soft-delete a hackathon, remove it from default lists/search, restrict delete/restore by role, and emit audit logs. | Completes the delete part of hackathon CRUD in a small context. Restore can mirror the contact restore pattern without adding a general recycle-bin abstraction. |
| Dashboard empty state and first widget | L2-032 | New-user dashboard route, empty state, add-widget CTA, and first-widget creation. | The current dashboard design bundles default layout, mutation, and persistence. This slice lets ATDD start with the smallest visible dashboard behavior. |
| Dashboard widget catalog add/remove | L2-033 | Widget catalog dialog, add widget, remove widget, JSON shape update, and component tests. | Keeps catalog and remove behavior separate from drag/resize mechanics. The test context can seed one dashboard and verify one JSON update. |
| Dashboard drag and resize persistence | L2-033 | Gridster drag/resize interactions, debounce save, API update, and restored coordinates. | Isolates the highest-risk dashboard interaction from widget catalog and layout restore. Acceptance tests can focus on one widget and one viewport. |
| Dashboard layout restore and last-write-wins | L2-035 | Per-user layout GET/PUT, sign-out/sign-in restore, cross-device restore, and concurrent update behavior. | Turns dashboard persistence into its own vertical slice with a narrow data contract and explicit conflict behavior. |
| SignalR connection lifecycle | L2-036 | Client connection start, reconnect policy, offline banner, recovered connection behavior, and sign-out disconnect. | The current realtime design bundles lifecycle, event payloads, and latency. This slice can be implemented before any domain event producer exists. |
| Team event envelope contract | L2-037 | Backend broadcast helper, event envelope schema, one producer, one consumer, and contract tests. | Establishes the required `eventType`, `entityId`, `actorId`, `timestamp`, and `data` envelope in a small vertical path before every feature publishes events. |
| Realtime latency budget harness | L2-048 | Two-client latency test fixture, 100-event publish run, p95/p99 calculation, and CI artifact output. | Keeps latency measurement independent from the functional SignalR connection work. This is a testable quality slice with one clear pass/fail budget. |

## Responsive And Theme Slices

| Proposed detailed design | Requirement traces | Scope | Description |
| --- | --- | --- | --- |
| App shell responsive navigation | L2-039, L2-040, L2-041 | Shell layout, side nav, hamburger drawer, breakpoint helper, and no-horizontal-scroll route smoke tests. | Splits app-wide responsive navigation out of the broad theme design. The vertical behavior is visible from any authenticated route. |
| List and detail responsive route patterns | L2-039, L2-040 | Shared list-card pattern, detail two-column pattern, mobile single-column fallback, and representative contact/partner tests. | Gives feature slices concrete responsive building blocks instead of asking each one to invent layout rules. |
| Dashboard responsive grid | L2-041, L2-033 | Dashboard grid column counts at xs/md/lg, max content width, and widget sizing constraints. | Keeps the 12-column desktop dashboard requirement separate from general shell responsiveness. |
| Dark theme token system | L2-042, L2-059 | SCSS tokens, Angular Material theme override, representative component render test, and no-light-mode enforcement. | Converts the broad dark-theme requirement into a small implementation slice with visible output and automated checks. |
| Chart and non-text contrast validation | L2-042, L2-059 | Chart.js token usage, focus/error/icon contrast checks, and representative dashboard chart test. | Chart contrast is easy to miss if it is folded into theme setup. This slice makes meaningful non-text contrast independently testable. |

## Observability Slices

| Proposed detailed design | Requirement traces | Scope | Description |
| --- | --- | --- | --- |
| Backend correlation and request logging | L2-044 AC1 | Correlation middleware, request log fields, response header, and one integration test for a normal request. | Implements the basic structured request log path without coupling it to exception or audit behavior. |
| Backend exception handling and error counter | L2-044 AC2 | Error middleware, generic 500 response, stack-trace logging, correlation preservation, and error counter increment. | Small failure-path slice with deterministic tests and no dependency on domain features. |
| Audit logging for sensitive domain events | L2-044 AC3 | Audit helper plus sign-in, sign-out, role assignment, delete/restore, lockout, and throttle event calls. | Adds audit coverage incrementally around known sensitive actions rather than designing a separate audit subsystem. |
| Frontend global error logging | L2-045 AC1, L2-045 AC3 | Angular global error handler, `/api/logs` endpoint, validation, persistence/tagging, and 5-second delivery test. | Covers browser-originated unhandled errors end to end with one API contract. |
| HTTP error logging and sanitization | L2-045 AC2, L2-045 AC3 | HTTP interceptor, correlation ID echo, failed XHR log body, secret stripping, and backend rejection/truncation rules. | Keeps failed-request logging separate from unhandled frontend exceptions and tests credential safety directly. |

## Performance Slices

| Proposed detailed design | Requirement traces | Scope | Description |
| --- | --- | --- | --- |
| Page-load performance budget harness | L2-046 | Production build, Playwright/Lighthouse run, primary-screen list, Slow 4G/Moto G4 profile, and artifact output. | Makes page-load budgets executable without changing product features. Each primary screen can then opt into the same harness. |
| API load and seeded data budget harness | L2-047 | Seed generator for expected volume, GET/mutation/search percentile tests, and summary reporting. | Separates backend budget verification from individual API feature work while still testing the real app and schema. |

## Security Slices

| Proposed detailed design | Requirement traces | Scope | Description |
| --- | --- | --- | --- |
| Production HTTPS and TLS enforcement | L2-049 | Production HTTPS redirect/refusal behavior, TLS 1.2/1.3 policy, cipher allowlist documentation, and smoke tests. | A small deployment/security slice that can be verified without touching business flows. |
| Password hashing storage proof | L2-050 | Identity password hasher configuration, registration/password-change proof tests, and database/log inspection checks. | Makes the password-storage requirement testable instead of leaving it as architecture intent. |
| Request validation and body-size limits | L2-051 | Validation behavior, structured 400 contract, per-endpoint validator inventory, and oversized body rejection. | Provides one consistent validation contract for every later vertical slice to follow. |
| Injection and stored-XSS hardening checks | L2-052, L2-053 | Static scans, fuzz payload suite, stored note/display-name XSS tests, and Angular dangerous API restrictions. | Combines related input/output abuse cases into one small security verification slice with clear failing examples. |
| CSRF token flow | L2-054 | Anti-CSRF token issuance, `X-CSRF-TOKEN` header validation, SameSite behavior, and state-changing endpoint tests. | Isolates CSRF mechanics from the auth/session designs so every mutating endpoint can share one pattern. |
| Sensitive endpoint rate limiting | L2-055 | Sign-in IP limit, failed-account lockout limit, password-recovery email limit, 429/generic responses, and audit logs. | Pulls throttle behavior into a narrow slice that can be implemented before broad abuse controls are needed. |
| Secrets scanning and runtime configuration | L2-056 | Source scan, checked-in config rules, production frontend bundle scan, and environment/secrets-store runtime loading. | Converts secrets management into a build/runtime verification slice with no product UI. |

## Accessibility Slices

| Proposed detailed design | Requirement traces | Scope | Description |
| --- | --- | --- | --- |
| Keyboard focus and dialog trap baseline | L2-057 | Focus ring style, tab order smoke tests, shared dialog focus trap, and return-focus behavior. | Gives feature slices a shared keyboard baseline and keeps modal behavior independently testable. |
| Accessible names, form errors, and live regions | L2-058 | Shared component labels, `aria-describedby` errors, decorative icon rules, notification live region, and accessibility snapshots. | Covers screen-reader semantics through shared components and one realtime notification path. |
| Contrast regression checks | L2-059 | Token contrast calculations, representative component checks, focus/error/icon contrast, and chart contrast tests. | Splits contrast from general accessibility so visual regressions have a dedicated automated gate. |

## Architecture And E2E Slices

| Proposed detailed design | Requirement traces | Scope | Description |
| --- | --- | --- | --- |
| Component library public API enforcement | L2-060 | Shared wrapper components, `public-api.ts`, direct Material import restriction, and import-scan tests. | Makes the component-library requirement enforceable before feature teams build more UI. |
| API library injection-token contract | L2-061 | API models, service interfaces, injection tokens, concrete providers, and mock substitution unit test. | Establishes the frontend API dependency pattern through one feature-facing service before expanding to every resource. |
| Backend CQRS/MediatR enforcement | L2-062 | Controller one-liner rule, request/response/handler shape, and architecture tests scanning controllers/handlers. | Turns the CQRS convention into a small automated check instead of relying on review comments. |
| Playwright Page Object foundation | L2-063 | Page object directory, base fixtures, mailbox fixture, selector rules, and no raw `page.locator(...)` in tests. | Creates the E2E structure before the individual flow tests are added. |
| E2E auth and session flow | L2-063, L2-064 | Register/verify, sign-in, sign-out, session rejection, and required viewport smoke coverage. | A small user-flow test design that proves the POM, mailbox, and viewport machinery works. |
| E2E contact management flow | L2-063, L2-064 | Contact create/view/update/delete/restore/notes flow using page objects and required viewport subset where applicable. | Covers the contact major flow without mixing in partner or dashboard behavior. |
| E2E partner management flow | L2-063, L2-064 | Partner create/view/update/delete, contact association, notes, stage change, and board/list assertions. | Keeps partner CRUD and funnel behavior in one domain-focused acceptance context. |
| E2E hackathon management flow | L2-063, L2-064 | Hackathon create/update/delete, 4 D's stage change, products, partners, and detail assertions. | Depends on the missing hackathon update/delete slices and closes the hackathon CRUD flow required by L2-063. |
| E2E team management flow | L2-063 | Invite member, accept invitation, assign/revoke roles, remove member, and verify access changes. | Tests the team-management lifecycle end to end without adding dashboard or search concerns. |
| E2E dashboard widget flow | L2-063, L2-064 | Add, move, resize, remove, persist, restore, and multi-viewport smoke for dashboard widgets. | Gives dashboard behavior a dedicated flow separate from the lower-level dashboard unit/integration slices. |
| E2E realtime notification flow | L2-063 | Two simulated clients, one domain action, SignalR event receipt, notification center update, and live-region assertion. | Keeps two-client realtime testing isolated from general notification-center CRUD. |
| E2E global search flow | L2-063, L2-064 | Open global search, query all entity groups, select a result, navigate, and mobile full-screen overlay check. | Covers the search major flow in a small context with deterministic seeded records. |
| Multi-viewport smoke matrix | L2-064 | Playwright projects for `375x667`, `768x1024`, and `1280x800`; required smoke flow assignment and CI wiring. | Separates viewport matrix mechanics from the individual E2E flows so each flow only declares whether it participates. |

## Suggested Authoring Order

1. Product gaps first: contact restore, hackathon list, hackathon update, and hackathon delete/restore.
2. Split dashboard and realtime bundled designs because many E2E flows depend on them.
3. Add architecture foundations: component library, API tokens, CQRS enforcement, and Playwright POM.
4. Add security and observability infrastructure before expanding feature implementation.
5. Add responsive, theme, accessibility, performance, and viewport-matrix designs as reusable quality gates.
