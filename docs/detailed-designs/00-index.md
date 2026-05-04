# Detailed Designs — Index

Each design below is a small vertical slice intended to be implemented end-to-end (frontend → API → DB) using ATDD. Read [`00-architecture/`](00-architecture/README.md) first — every slice assumes that baseline. The implementation principle for every slice is **radical simplicity**: smallest thing that satisfies the L2 acceptance criteria, no speculative abstractions.

| # | Slice | L2 traces | Status |
|---|-------|-----------|--------|
| 00 | [Architecture overview](00-architecture/README.md) | shared baseline | Draft |
| 01 | [Project skeleton & health check](01-project-skeleton/README.md) | bootstraps everything | Draft |
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

## Slices intentionally not authored

These L2 requirements are cross-cutting and addressed in `00-architecture/` rather than as separate vertical slices: L2-039, L2-040, L2-041 (responsive layouts — applied on every slice), L2-042 (theme — applied app-wide), L2-044, L2-045 (logging — pipeline behavior + global error handler), L2-046, L2-047, L2-048 (perf budgets — verified by Lighthouse and load tests), L2-049 through L2-056 (security — applied app-wide), L2-057, L2-058, L2-059 (a11y — verified per slice during E2E + Lighthouse), L2-060, L2-061, L2-062 (component library / api library / MediatR architecture — covered in `00-architecture/`), L2-063, L2-064 (E2E test framework — every slice contributes Playwright tests).

## Suggested implementation order

01 → 02 → 03 → 05 → 06 → 04 → 07 → 32 → 08 → 09 → 14 → 12 → 10 → 11 → 13 → 33 → 15 → 19 → 18 → 17 → 16 → 20 → 21 → 24 → 22 → 23 → 25 → 28 → 26 → 27 → 29 → 30 → 31 → 34.

Realtime infrastructure (32) lands early because nine later slices publish events through it. Notification center (33) lands as soon as the first publisher exists.
