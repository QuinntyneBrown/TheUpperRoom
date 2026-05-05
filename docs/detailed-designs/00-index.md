# Detailed Designs — Index

Each design below is a small vertical slice intended to be implemented end-to-end (frontend → API → DB) using ATDD. Read [`00-architecture/`](00-architecture/README.md) first — every slice assumes that baseline. The implementation principle for every slice is **radical simplicity**: smallest thing that satisfies the L2 acceptance criteria, no speculative abstractions.

| # | Slice | L2 traces | Status |
|---|-------|-----------|--------|
| 00 | [Architecture overview](00-architecture/README.md) | shared baseline | Draft |
| 01 | [Project skeleton & health check](01-project-skeleton/README.md) | bootstraps everything | Complete |
| 02 | [User registration](02-user-registration/README.md) | L2-001 | Draft |
| 03 | [User sign-in](03-user-signin/README.md) | L2-002 | Draft |
| 04 | [Password recovery](04-password-recovery/README.md) | L2-003 | Draft |
| 05 | [Session management](05-session-management/README.md) | L2-004 | Draft |
| 06 | [User sign-out](06-user-signout/README.md) | L2-005 | Draft |
| 07 | [RBAC: roles, endpoint authz, team isolation](07-rbac-authorization/README.md) | L2-006, L2-007, L2-008 | Draft |
| 08 | [Create contact](08-create-contact/README.md) | L2-009 | Draft |
| 09 | [View contact](09-view-contact/README.md) | L2-010 | Draft |
| 10 | [Update contact](10-update-contact/README.md) | L2-011 | Draft |
| 11 | [Delete contact (soft delete)](11-delete-contact/README.md) | L2-012 | Draft |
| 12 | [Contact notes](12-contact-notes/README.md) | L2-013 | Draft |
| 13 | [Search contacts](13-search-contacts/README.md) | L2-014 | Draft |
| 14 | [List & paginate contacts](14-list-contacts/README.md) | L2-015 | Draft |
| 15 | [Create partner](15-create-partner/README.md) | L2-016 | Draft |
| 16 | [Move partner through funnel stages](16-partner-funnel/README.md) | L2-017 | Draft |
| 17 | [Associate contacts with partner](17-partner-contacts/README.md) | L2-018 | Draft |
| 18 | [Partner notes](18-partner-notes/README.md) | L2-019 | Draft |
| 19 | [View / Update / Delete partner](19-view-update-delete-partner/README.md) | L2-020 | Draft |
| 20 | [Partner funnel board (Kanban)](20-partner-board/README.md) | L2-021 | Draft |
| 21 | [Create hackathon](21-create-hackathon/README.md) | L2-022 | Draft |
| 22 | [Track 4 D's process stage](22-hackathon-4ds/README.md) | L2-023 | Draft |
| 23 | [Document hackathon products](23-hackathon-products/README.md) | L2-024 | Draft |
| 24 | [View hackathon details](24-hackathon-detail/README.md) | L2-025 | Draft |
| 25 | [View local team](25-view-local-team/README.md) | L2-026 | Draft |
| 26 | [Invite team member](26-invite-team-member/README.md) | L2-027 | Draft |
| 27 | [Remove team member](27-remove-team-member/README.md) | L2-028 | Draft |
| 28 | [Assign / revoke team role](28-assign-role/README.md) | L2-029 | Draft |
| 29 | [View & search global teams](29-view-global-teams/README.md) | L2-030, L2-031 | Draft |
| 30 | [Dashboard layout, widgets, persistence](30-dashboard/README.md) | L2-032, L2-033, L2-035 | Draft |
| 31 | [Real-time line-chart widget](31-realtime-charts/README.md) | L2-034 | Draft |
| 32 | [SignalR connection lifecycle & push events](32-signalr-realtime/README.md) | L2-036, L2-037, L2-048 | Draft |
| 33 | [Notification center](33-notification-center/README.md) | L2-038 | Draft |
| 34 | [Global search](34-global-search/README.md) | L2-043 | Draft |
| 35 | [Responsive layouts and dark theme](35-responsive-theme/README.md) | L2-039, L2-040, L2-041, L2-042, L2-059 | Draft |
| 36 | [Logging and observability](36-observability/README.md) | L2-044, L2-045 | Draft |
| 37 | [Performance and scalability](37-performance/README.md) | L2-046, L2-047 | Draft |
| 38 | [Data protection and application security](38-security/README.md) | L2-049, L2-050, L2-051, L2-052, L2-053, L2-054, L2-055, L2-056 | Draft |
| 39 | [Accessibility](39-accessibility/README.md) | L2-057, L2-058, L2-059 | Draft |
| 40 | [Component, API, CQRS, and E2E test architecture](40-architecture-testing/README.md) | L2-060, L2-061, L2-062, L2-063, L2-064 | Draft |

## Vertical refinements (small slices)

These slices were derived from the gaps identified in [`docs/missing-detailed-designs.md`](../missing-detailed-designs.md). Each refines a piece of one of the bundled designs above into a small, independently testable vertical slice. Implementing these in order replaces the bundled designs with focused, ATDD-friendly contexts.

### Functional product slices

| # | Slice | L2 traces | Status |
|---|-------|-----------|--------|
| 41 | [Contact audit and restore view](41-contact-audit-restore/README.md) | L2-012 | Draft |
| 42 | [Partner list stage filtering](42-partner-list-stage-filter/README.md) | L2-021, L2-046 | Draft |
| 43 | [Hackathon list and navigation](43-hackathon-list/README.md) | L2-025, L2-046, L2-063 | Draft |
| 44 | [Update hackathon details](44-update-hackathon/README.md) | L2-063, supports L2-022/L2-025 | Draft |
| 45 | [Delete and restore hackathon](45-delete-restore-hackathon/README.md) | L2-063, L2-008, L2-044 | Draft |
| 46 | [Dashboard empty state and first widget](46-dashboard-empty-first-widget/README.md) | L2-032 | Draft |
| 47 | [Dashboard widget catalog add/remove](47-dashboard-catalog-add-remove/README.md) | L2-033 | Draft |
| 48 | [Dashboard drag and resize persistence](48-dashboard-drag-resize/README.md) | L2-033 | Draft |
| 49 | [Dashboard layout restore and last-write-wins](49-dashboard-restore-lww/README.md) | L2-035 | Draft |
| 50 | [SignalR connection lifecycle](50-signalr-lifecycle/README.md) | L2-036 | Draft |
| 51 | [Team event envelope contract](51-team-event-envelope/README.md) | L2-037 | Draft |
| 52 | [Realtime latency budget harness](52-realtime-latency-harness/README.md) | L2-048 | Draft |

### Responsive and theme slices

| # | Slice | L2 traces | Status |
|---|-------|-----------|--------|
| 53 | [App shell responsive navigation](53-shell-responsive-nav/README.md) | L2-039, L2-040, L2-041 | Accepted |
| 54 | [List and detail responsive route patterns](54-list-detail-responsive/README.md) | L2-039, L2-040 | Draft |
| 55 | [Dashboard responsive grid](55-dashboard-responsive-grid/README.md) | L2-041, L2-033 | Draft |
| 56 | [Dark theme token system](56-dark-theme-tokens/README.md) | L2-042, L2-059 | Complete |
| 57 | [Chart and non-text contrast validation](57-chart-contrast/README.md) | L2-042, L2-059 | Draft |

### Observability slices

| # | Slice | L2 traces | Status |
|---|-------|-----------|--------|
| 58 | [Backend correlation and request logging](58-correlation-request-logging/README.md) | L2-044 AC1 | Draft |
| 59 | [Backend exception handling and error counter](59-error-middleware-counter/README.md) | L2-044 AC2 | Draft |
| 60 | [Audit logging for sensitive domain events](60-audit-logging/README.md) | L2-044 AC3 | Draft |
| 61 | [Frontend global error logging](61-frontend-error-logging/README.md) | L2-045 AC1, AC3 | Draft |
| 62 | [HTTP error logging and sanitization](62-http-error-logging/README.md) | L2-045 AC2, AC3 | Draft |

### Performance slices

| # | Slice | L2 traces | Status |
|---|-------|-----------|--------|
| 63 | [Page-load performance budget harness](63-pageload-budget-harness/README.md) | L2-046 | Draft |
| 64 | [API load and seeded data budget harness](64-api-load-budget-harness/README.md) | L2-047 | Draft |

### Security slices

| # | Slice | L2 traces | Status |
|---|-------|-----------|--------|
| 65 | [Production HTTPS and TLS enforcement](65-https-tls/README.md) | L2-049 | Draft |
| 66 | [Password hashing storage proof](66-password-hashing/README.md) | L2-050 | Draft |
| 67 | [Request validation and body-size limits](67-validation-body-limits/README.md) | L2-051 | Draft |
| 68 | [Injection and stored-XSS hardening checks](68-injection-xss-checks/README.md) | L2-052, L2-053 | Draft |
| 69 | [CSRF token flow](69-csrf-token/README.md) | L2-054 | Draft |
| 70 | [Sensitive endpoint rate limiting](70-rate-limiting/README.md) | L2-055 | Draft |
| 71 | [Secrets scanning and runtime configuration](71-secrets-runtime/README.md) | L2-056 | Draft |

### Accessibility slices

| # | Slice | L2 traces | Status |
|---|-------|-----------|--------|
| 72 | [Keyboard focus and dialog trap baseline](72-keyboard-focus-traps/README.md) | L2-057 | Draft |
| 73 | [Accessible names, form errors, and live regions](73-aria-forms-live/README.md) | L2-058 | Draft |
| 74 | [Contrast regression checks](74-contrast-regression/README.md) | L2-059 | Draft |

### Architecture and E2E slices

| # | Slice | L2 traces | Status |
|---|-------|-----------|--------|
| 75 | [Component library public API enforcement](75-component-library-public-api/README.md) | L2-060 | Draft |
| 76 | [API library injection-token contract](76-api-injection-tokens/README.md) | L2-061 | Draft |
| 77 | [Backend CQRS/MediatR enforcement](77-cqrs-mediatr-enforcement/README.md) | L2-062 | Draft |
| 78 | [Playwright Page Object foundation](78-playwright-pom/README.md) | L2-063 | Draft |
| 79 | [E2E auth and session flow](79-e2e-auth-session/README.md) | L2-063, L2-064 | Draft |
| 80 | [E2E contact management flow](80-e2e-contact-flow/README.md) | L2-063, L2-064 | Draft |
| 81 | [E2E partner management flow](81-e2e-partner-flow/README.md) | L2-063, L2-064 | Draft |
| 82 | [E2E hackathon management flow](82-e2e-hackathon-flow/README.md) | L2-063, L2-064 | Draft |
| 83 | [E2E team management flow](83-e2e-team-flow/README.md) | L2-063 | Draft |
| 84 | [E2E dashboard widget flow](84-e2e-dashboard-flow/README.md) | L2-063, L2-064 | Draft |
| 85 | [E2E realtime notification flow](85-e2e-realtime-flow/README.md) | L2-063 | Draft |
| 86 | [E2E global search flow](86-e2e-search-flow/README.md) | L2-063, L2-064 | Draft |
| 87 | [Multi-viewport smoke matrix](87-viewport-matrix/README.md) | L2-064 | Draft |

## Cross-cutting slices

Requirements L2-039 through L2-064 are cross-cutting. They are addressed by the bundled designs (35-40) and refined into the small vertical slices listed above (41-87).

## Suggested implementation order

Foundations first (architecture, observability, security, theme):

01 → 56 → 53 → 54 → 55 → 72 → 73 → 74 → 57 → 75 → 76 → 77 → 78 → 58 → 59 → 60 → 61 → 62 → 65 → 66 → 67 → 68 → 69 → 70 → 71 → 63 → 64 → 87.

Then auth and product:

02 → 03 → 05 → 06 → 04 → 07 → 50 → 51 → 52 → 79 → 08 → 09 → 14 → 12 → 10 → 11 → 41 → 13 → 80 → 33 → 15 → 19 → 18 → 17 → 16 → 42 → 20 → 81 → 21 → 43 → 24 → 44 → 22 → 23 → 45 → 82 → 25 → 28 → 26 → 27 → 83 → 29 → 46 → 47 → 48 → 49 → 30 → 31 → 84 → 85 → 34 → 86.

Realtime infrastructure (50, 51) lands early because nine later slices publish events through it. Notification center (33) lands as soon as the first publisher exists.
