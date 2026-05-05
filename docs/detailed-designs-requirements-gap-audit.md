# Detailed Designs Requirements Gap Audit

Date: 2026-05-05

Sources:
- `docs/detailed-designs`
- `docs/specs/L1.md`
- `docs/specs/L2.md`

## Scope

This audit compares the detailed design markdown and PlantUML artifacts in `docs/detailed-designs` against the L1 and L2 requirements in `docs/specs`.

The detailed designs are treated as implementation plans, not completed implementation. A requirement is considered covered only when the design gives enough concrete direction to implement and acceptance-test the behavior. A requirement is considered partial when it is only referenced, delegated to another slice without enough detail, or lacks acceptance-criterion-level coverage.

## Design Inventory

The detailed design set contains:

- `00-architecture`: shared architecture baseline, C4 diagrams, domain model, cross-cutting concerns.
- `01-project-skeleton`: health check and workspace bootstrapping.
- `02` through `34`: vertical slices covering authentication, authorization, contacts, partners, hackathons, team, dashboard, realtime, notifications, and search.
- `00-index.md`: slice index and intentionally unauthored cross-cutting requirements.

The index marks every slice as `Draft`.

## Executive Summary

The detailed designs are much more complete than the UI design file. They reference every L2 requirement ID somewhere in the design set and provide vertical slices for most product features.

The largest remaining gap is depth, not traceability. Several requirements are only mentioned at architecture level and do not yet have enough concrete design for implementation or acceptance testing. This is most visible in responsive behavior, theming, logging, performance, security, accessibility, component/API architecture, and E2E test coverage.

There are also several requirement-level misses inside the vertical slices:

- `L2-009` create contact omits the optional initial notes field required by the requirement.
- `L2-008` cross-team data isolation is under-specified for Administrator bypass and public global-team summaries.
- `L2-037` realtime event payloads omit required `actorId` and `timestamp` fields in most event definitions.
- `L2-048` realtime latency is designed as a simple 2-second check, not the required 95th/99th percentile latency budget.
- `L2-044` and `L2-045` logging are far too thin for the required request, exception, frontend error, and sanitization behavior.
- `L2-049` through `L2-056` security controls are mostly one-line architecture notes and need concrete implementation/test design.
- `L2-057` through `L2-059` accessibility requirements are delegated to E2E/Lighthouse without design details.
- `L2-063` and `L2-064` E2E design lacks a concrete Page Object Model and multi-viewport matrix.

## Status Legend

| Status | Meaning |
| --- | --- |
| Covered | Design gives enough implementation and acceptance-test direction for the requirement. |
| Partial | Requirement is addressed but misses one or more acceptance criteria, design details, or test details. |
| Thin | Requirement is referenced but mostly delegated to future implementation or broad architecture notes. |
| Conflict | Design contradicts itself or the requirement. |

## Traceability Summary

Direct vertical slices exist for:

- `L2-001` through `L2-038`
- `L2-043`
- `L2-048` through slice `32-signalr-realtime`

Cross-cutting requirements are intentionally not authored as separate vertical slices and are instead pushed into `00-architecture` or the index:

- `L2-039` through `L2-042`
- `L2-044` through `L2-047`
- `L2-049` through `L2-064`

That approach is reasonable, but the cross-cutting entries are currently too terse for several high-risk requirements. A one-line architecture note is not enough for logging, TLS, password storage, CSRF, rate limiting, accessibility, or E2E viewport coverage.

## Highest-Priority Gaps

### P0: Must Fix Before Implementation Depends On These Designs

1. Add optional initial notes to contact creation.
   - Requirement: `L2-009`.
   - Current design: `08-create-contact` command and API include `FirstName`, `LastName`, `Email`, `Phone`, and `City`, but not `Notes`.
   - Impact: Implementing from the design would fail the requirement that create contact supports optional free-form notes.

2. Fix realtime event payloads.
   - Requirements: `L2-037`, `L2-048`.
   - Current design: `32-signalr-realtime` event catalog often includes entity IDs but omits `actorId` and `timestamp`. Some producer slices also omit those fields.
   - Required: every significant team event message must include event type, entity ID, actor ID, and timestamp, and latency must be measured against 95th/99th percentile budgets.

3. Expand cross-team data isolation coverage.
   - Requirement: `L2-008`.
   - Current design: `07-rbac-authorization` tests non-Admin cross-team mutation, but does not explicitly test Administrator bypass or public-only global-team summary fields.
   - Note: `L2-008 AC3` in the spec likely refers to global team listing and says "per L2-033"; this appears to be a spec typo because global team listing is `L2-030`.

4. Resolve team removal data model conflict.
   - Requirement: `L2-028`.
   - Current design: `27-remove-team-member` says set `User.IsActive=false`, while its open question default says set `TeamId` to null and revoke roles. The domain diagram defines `User.TeamId: Guid`, not nullable, and does not show `IsActive`.
   - Impact: The model, handler behavior, and session invalidation semantics are inconsistent.

5. Make logging design acceptance-criterion complete.
   - Requirements: `L2-044`, `L2-045`.
   - Current design: `00-architecture` says "Serilog JSON sink" and frontend forwards logs, but does not define all required fields, exception middleware behavior, generic 500 behavior, error counter, HTTP interceptor behavior, sanitization, or acceptance tests.

6. Make security design concrete.
   - Requirements: `L2-049` through `L2-056`.
   - Current design: security controls are mostly one-line notes. TLS protocol/cipher behavior, password-hash configuration, request-size limits, CSRF token issuance/header checks, fuzzing/static-analysis tests, secret scanning, and rate-limit audit logging need explicit design.

7. Add accessibility design, not only test intent.
   - Requirements: `L2-057` through `L2-059`.
   - Current design: index says accessibility is verified per slice with E2E and Lighthouse, but slices do not specify focus behavior, tab order, accessible names, ARIA live regions, modal focus traps, or contrast validation.

### P1: Significant Requirement Coverage Gaps

1. Strengthen acceptance tests for auth.
   - `L2-001`: only happy-path registration/verification is shown; duplicate email generic response, password-strength rejection, and email-within-30-seconds are not tested.
   - `L2-002`: only successful sign-in is shown; unverified account, invalid generic message, and 5-failure lockout are not tested.
   - `L2-003`: only happy-path password reset is shown; generic recovery message and expired/used token states are not tested.
   - `L2-005`: tests replay cookie and SignalR disconnect, but not redirect within 1 second or client cookie-clearing behavior.

2. Add missing UI/backend designs around restore and admin views.
   - `L2-012`: backend restore command is listed, but no Administrator audit/restore view is designed.
   - `L2-030`: public vs Administrator team detail is described, but should be tied back to `L2-008 AC3`.

3. Tighten hackathon detail team scoping.
   - Requirement: `L2-025`, plus `L2-008`.
   - Current design: `Hackathons/GetHackathonQuery { Id }` does not implement `ITeamScopedRequest` or define how cross-team access is rejected.
   - Also ensure returned detail explicitly includes dates, host city, current stage, partners, products, and stage history.

4. Add missing search minimum-length tests.
   - Requirement: `L2-031`.
   - Current design: `29-view-global-teams` says the frontend search input is `>=2` chars, but acceptance tests only cover matching within 500 ms. `L2-031 AC2` is not explicitly tested.

5. Complete chart and responsive acceptance criteria.
   - `L2-034 AC3`: design says legend wraps and tap shows tooltip, but acceptance tests omit mobile legibility and touch interaction.
   - `L2-039` through `L2-041`: no single place defines app-wide responsive rules, max width, 12-column dashboard grid behavior, horizontal-scroll policy, or 44x44 hit targets.

6. Clarify component/API architecture enforcement.
   - `L2-060`: architecture says feature libs depend on `components`, but there is no enforcement/test design that blocks direct `@angular/material` imports.
   - `L2-061`: architecture says API tokens exist, but no acceptance test design proves mocks can be substituted via injection tokens.
   - `L2-062`: architecture says controllers are one-liners, but no test/static-analysis approach verifies one MediatR request per controller action.

7. Make E2E plan executable.
   - `L2-063`: design states Playwright with Page Object Model, but most slice examples are small snippets and do not define POM classes or the full flow matrix.
   - `L2-064`: no concrete Playwright project matrix is defined for 375x667, 768x1024, and 1280x800.

### P2: Lower-Risk Design Cleanup

1. Normalize role naming.
   - Requirements use `Administrator`; designs often use `Admin`.
   - This is acceptable as an internal constant only if the UI/API mapping is explicit.

2. Update domain model diagram.
   - Add `UpdatedById` to `Contact` if implementation relies on it for `L2-011`.
   - Add `IsActive` or nullable `TeamId` decision for removed users.
   - Add explicit join entities used in slices, such as `ProductMember`, if diagrams are intended as implementation source.

3. Remove raw-SQL ambiguity.
   - `00-architecture` says EF Core only and no raw SQL for injection prevention, but some slice notes use phrases like `INSERT ... ON CONFLICT` or `DELETE FROM PartnerContact`.
   - Clarify whether these are conceptual or actual SQL.

4. Keep cross-cutting requirements in the index, but add short design files where the behavior is high risk.
   - Good candidates: logging/observability, security, accessibility, responsive behavior, E2E test framework.

## L1 Coverage Matrix

| L1 | Status | Assessment |
| --- | --- | --- |
| L1-001 User Authentication | Partial | Slices `02` through `06` cover the core flow, but acceptance tests are mostly happy-path and miss several required error/security states. |
| L1-002 Role-Based Authorization | Partial | RBAC and route guard are designed, but `L2-008` Administrator bypass and public summary isolation need explicit tests. |
| L1-003 Contact Management | Partial | CRUD/list/search/notes are mostly covered, but create contact omits optional notes and admin restore UI is not designed. |
| L1-004 Partner Management | Covered/Partial | Partner CRUD, funnel, notes, contacts, and board are designed. Realtime payload and some permission/test details need tightening. |
| L1-005 Hackathon Management | Partial | Create, stage, products, and detail are designed, but team scoping and full detail response content need explicit coverage. |
| L1-006 Team Management | Partial | Local/global team, invite, remove, and roles are designed; removal conflicts with the domain model, and search minimum-length test is missing. |
| L1-007 Configurable Dashboard | Partial | Dashboard layout, widgets, persistence, and charts are designed. JSON validation and mobile chart acceptance coverage need work. |
| L1-008 Real-Time Updates and Notifications | Partial | SignalR and notification center are designed, but event payloads and latency percentile requirements are incomplete. |
| L1-009 Responsive Mobile-First Design | Thin | Responsive behavior is scattered across slices; no app-wide detailed design covers all breakpoints and hit-target rules. |
| L1-010 Dark Monochromatic Theming | Thin | Architecture says single dark theme, but palette, contrast, chart colors, and Material override details are not specified. |
| L1-011 Cross-Entity Search | Partial | Contact/global/team search are designed; global search is stronger than team search, but some minimum-length tests are missing. |
| L1-012 Logging and Observability | Thin | Logging is a high-level architecture note; frontend/backend required fields and tests are under-specified. |
| L1-013 Performance and Scalability | Thin | Search/realtime touch some budgets, but page-load, API percentile, load, and Lighthouse designs are missing. |
| L1-014 Data Protection and Application Security | Thin | Security controls are named but not designed/tested at acceptance level. |
| L1-015 Accessibility | Thin | Accessibility is delegated to tests without enough design guidance. |
| L1-016 Reusable Component Library | Partial | Architecture establishes a components library but lacks enforcement details and component-state completeness. |
| L1-017 API Contract and Decoupled Integration | Partial | API library and injection-token direction exists, but substitution and public API acceptance details are missing. |
| L1-018 End-to-End Test Coverage | Thin | Playwright/POM is named, but the flow matrix and viewport matrix are not designed concretely. |

## Detailed L2 Coverage

### Authentication

| Requirement | Status | Notes |
| --- | --- | --- |
| L2-001 User Registration | Partial | Design includes registration, verification, password rules, duplicate generic response. Acceptance test only covers happy path; missing duplicate email, password failure, and email timing test. |
| L2-002 User Sign-In | Partial | Sign-in, generic 401, unverified 403, lockout and rate limit are named. Acceptance test only covers successful sign-in. |
| L2-003 Password Recovery | Partial | Recovery/reset flow is designed. Missing explicit acceptance tests for generic message and expired/already-used link. |
| L2-004 Session Management | Covered | Cookie attributes, sliding expiration, and 12-hour cap are designed and acceptance-tested. |
| L2-005 User Sign-Out | Partial | Backend sign-out and SignalR disconnect are designed. Missing explicit redirect-within-1-second and client cookie-clearing test details. |

### Authorization

| Requirement | Status | Notes |
| --- | --- | --- |
| L2-006 Role Definitions and Assignment | Partial | Five roles exist, but non-Admin/non-CityLead assignment rejection (`AC3`) is not explicit in tests. Role naming uses `Admin` internally. |
| L2-007 Endpoint Authorization Enforcement | Covered/Partial | 401, 403/audit, and route guard redirect are listed. Needs route-module-not-loaded verification detail for AC3. |
| L2-008 Cross-Team Data Isolation | Partial | Non-Admin rejection is designed. Administrator bypass and public global-team summary field isolation are not explicitly tested under this requirement. |

### Contact Management

| Requirement | Status | Notes |
| --- | --- | --- |
| L2-009 Create Contact | Partial | Required fields and validation are designed, but optional free-form notes are omitted from command/API/form. Acceptance tests miss validation cases. |
| L2-010 View Contact | Covered/Partial | Detail fields, notes order, cross-team 404, and mobile layout are covered. Ensure notes are populated once slice 12 lands. |
| L2-011 Update Contact | Covered | Optimistic concurrency, timestamps, modifying user, and 409 are designed. |
| L2-012 Delete Contact | Partial | Soft delete, role restriction, and restore command exist. Missing Administrator audit/restore UI design. |
| L2-013 Contact Notes | Covered/Partial | Note CRUD, 4000-char validation, author/override rules are designed. Team-scope enforcement for note target should be explicit. |
| L2-014 Search Contacts | Partial | Query fields, minimum length, snippets, and highlighting are designed. Acceptance tests omit result display with highlighted term. |
| L2-015 List And Paginate Contacts | Covered | Pagination, sorting, mobile cards, and collapsed controls are designed. |

### Partner Management

| Requirement | Status | Notes |
| --- | --- | --- |
| L2-016 Create Partner | Covered/Partial | Create/default stage/website validation are designed. Explicit 1-second return budget and team attribution test should be added. |
| L2-017 Move Partner Through Funnel | Partial | Stage history and SignalR update are designed. Event payload needs actor/timestamp and latency test detail. |
| L2-018 Associate Contacts With Partner | Covered/Partial | Add existing, create-and-associate, and remove association are designed. Team scoping of partner/contact association should be explicit. |
| L2-019 Partner Notes | Partial | Reuses contact note design. Needs explicit partner-specific team-scope and permission tests rather than "same shape" only. |
| L2-020 View/Update/Delete Partner | Covered/Partial | Detail/update/delete behavior is covered. Confirmation and detach behavior are present; validation/concurrency details are thin but not central to the L2. |
| L2-021 Partner Board | Covered | Stage filters, three columns at >=768px, and single-column mobile stack are designed. |

### Hackathon Management

| Requirement | Status | Notes |
| --- | --- | --- |
| L2-022 Create Hackathon | Covered/Partial | Create/default stage/date validation/partners are designed. Host city validation should be explicit. |
| L2-023 Track 4 D's Stage | Partial | Stage update/history/realtime are designed; architecture domain has Discover/Design/Develop/Deploy. Event payload needs actor/timestamp. |
| L2-024 Hackathon Products | Covered/Partial | Product fields, URL validation, and member assignment are designed. Domain diagram should include `ProductMember`. |
| L2-025 View Hackathon Details | Partial | Detail page sections and mobile accordions are designed. Query lacks explicit team scoping and does not explicitly list dates/current stage in response. |

### Team Management

| Requirement | Status | Notes |
| --- | --- | --- |
| L2-026 View Local Team | Covered/Partial | Fields and responsive layout are designed. Sorting should be specified in the query/handler, not only the test. |
| L2-027 Add Team Member | Covered/Partial | Invite and registration integration are designed. Link expiry is acceptance-tested but should be set explicitly in component/data model notes. |
| L2-028 Remove Team Member | Conflict | Design conflicts on `IsActive=false` vs nullable `TeamId`; domain diagram supports neither nullable `TeamId` nor `IsActive`. |
| L2-029 Assign Team Role | Covered/Partial | Role toggle and constraints are designed. Event payload needs actor/timestamp under L2-037. |
| L2-030 View Global Teams | Covered/Partial | List/detail/public/Admin branches are designed. Tie public-field behavior back to `L2-008 AC3`. |
| L2-031 Search Global Teams | Partial | Search by city/member is designed. Missing explicit no-search behavior for terms under 2 characters. |

### Dashboard, Realtime, Notifications, Search

| Requirement | Status | Notes |
| --- | --- | --- |
| L2-032 Default Dashboard Layout | Covered | Empty dashboard and Add Widget CTA are designed. |
| L2-033 Add/Resize/Reposition Widgets | Covered/Partial | Gridster, catalog, drag/resize/remove, and persistence are designed. JSON validation remains an open question. |
| L2-034 Real-Time Metric Charts | Partial | Chart rendering and realtime invalidation/refetch are designed. Mobile legibility/tap acceptance test is missing. |
| L2-035 Persisted Dashboard Layout | Covered/Partial | Restore and last-write-wins are designed. Backend JSON validation should be resolved. |
| L2-036 Realtime Connection Lifecycle | Covered/Partial | Connect/reconnect/disconnect are designed. The indefinite retry array needs an implementable pattern rather than literal ellipsis. |
| L2-037 Push Notifications For Team Events | Partial | Events and screen updates are designed. Payload catalog omits required actor ID and timestamp for most events. |
| L2-038 Notification Center | Covered | Persistence, unread/read, click-through, and mark-all-read are designed. |
| L2-043 Global Search | Covered | Grouped search, selection navigation, and mobile full-screen overlay are designed. |

### Cross-Cutting Requirements

| Requirement | Status | Notes |
| --- | --- | --- |
| L2-039 Extra-Small Viewport | Thin | Scattered per-slice notes exist; no app-wide design proves every screen is single-column, nav collapses, no horizontal scroll, and 44x44 hit targets. |
| L2-040 Small/Medium Viewport | Thin | Some slices mention tablet behavior, but no comprehensive design covers every list/detail screen and partner board behavior. |
| L2-041 Large/Extra-Large Viewport | Thin | No detailed max-width rule or 12-column dashboard grid specification. |
| L2-042 Dark Monochromatic Theme | Thin | Single dark theme is named, but palette, luminance, Material override, and Chart.js color rules are not detailed. |
| L2-044 Backend Logging | Thin | Needs full request/response/exception/auth/domain event logging design, fields, error counter, generic 500 behavior, and tests. |
| L2-045 Frontend Logging | Thin | Needs global error handler, HTTP interceptor, backend log endpoint validation, secret stripping, fields, and tests. |
| L2-046 Page Load Performance | Thin | No Lighthouse/Slow 4G/Moto G4 budget design per primary screen. |
| L2-047 API Response Time | Thin | No load-test design for GET/POST/PUT/DELETE/search percentile budgets. |
| L2-048 Realtime Message Latency | Partial | Slice 32 tests 2-second delivery but not 95th <=2s and 99th <=5s percentile budgets. |
| L2-049 Encryption In Transit | Thin | HTTPS is implied in diagrams, but TLS 1.2/1.3, redirect/refuse behavior, and cipher allowlist are not designed. |
| L2-050 Password Storage | Partial | Argon2id is named, but implementation mechanism and parameters are ambiguous; no storage/log inspection test is designed. |
| L2-051 Input Validation | Partial | FluentValidation is named, but not every endpoint has explicit schema coverage; request-size limits are missing. |
| L2-052 Injection Prevention | Thin | "EF Core only" is named, but static-analysis/fuzzing tests are not designed; raw-SQL wording is ambiguous in some slices. |
| L2-053 Output Encoding/XSS | Thin | Angular escaping is named, but no review rule or stored-XSS test design is present. |
| L2-054 CSRF Protection | Thin | SameSite plus anti-forgery token is named, but token issuance/header validation and tests are missing. |
| L2-055 Rate Limiting | Partial | Sign-in/recovery limits are designed. Lockout/throttle logging and exact per-email behavior should be explicit. |
| L2-056 Secrets Management | Partial | Environment variables are named, but `appsettings.{Environment}.json` wording risks violating "not checked-in config"; no scanning/build inspection test. |
| L2-057 Keyboard Navigation | Thin | No focus order, focus ring, dialog trap, or return-focus design. |
| L2-058 Screen Reader Support | Thin | No accessible names, roles, ARIA, or live-region design. |
| L2-059 Color Contrast | Thin | No contrast-token audit or chart/focus/error contrast design. |
| L2-060 Reusable Component Library | Partial | Architecture rule exists, but no public API/export map or direct-Material-import enforcement. |
| L2-061 API Library With Injection Tokens | Partial | API token direction exists, but no model inventory or mock-substitution test design. |
| L2-062 Backend CQRS With MediatR | Partial | One request/handler pattern is stated, but no static/test enforcement for controller one-liners and handler shape. |
| L2-063 Playwright E2E Coverage | Thin | POM is named, but flow coverage matrix and page object inventory are not designed. |
| L2-064 E2E Multiple Viewports | Thin | No concrete Playwright projects or smoke subset matrix for 375x667, 768x1024, 1280x800. |

## Open Questions Found In Designs

The following open questions should be resolved or promoted to explicit design decisions:

- `01-project-skeleton`: whether health check needs a real DB row.
- `02-user-registration`: how email is captured in E2E.
- `07-rbac-authorization`: MediatR pipeline order between logging, validation, and team scope.
- `27-remove-team-member`: removed user lifecycle, which currently conflicts with the domain model.
- `30-dashboard`: dashboard JSON validation responsibility and maximum schema enforcement.

## Recommended Remediation Order

1. Patch `08-create-contact` to include optional notes and tests.
2. Patch `32-signalr-realtime` event catalog and all producer slices to include `actorId` and `timestamp`; add percentile latency test design.
3. Patch `07-rbac-authorization` and `29-view-global-teams` so all `L2-008` acceptance criteria are explicitly covered.
4. Resolve `27-remove-team-member` model/handler conflict and update `class_domain.puml`.
5. Add dedicated cross-cutting detailed designs for logging, security, accessibility, responsive behavior, and E2E test framework.
6. Expand auth acceptance tests to cover all error and timing conditions.
7. Add implementation-enforcement checks for component imports, API injection tokens, and MediatR controller/handler structure.
8. Update domain diagrams to match slice entities and final decisions.

