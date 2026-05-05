# 40 - Component, API, CQRS, and E2E Test Architecture ✅ Complete

**Traces to:** L2-060, L2-061, L2-062, L2-063, L2-064 (L1-016, L1-017, L1-018, L1-009).

This cross-cutting design makes architecture and acceptance-test requirements enforceable.

## Component Library Enforcement

- `frontend/projects/components` exports branded wrappers for buttons, dialogs, error messages, notifications, form fields, snackbars, empty states, loading states, segmented controls, and layout primitives.
- Feature libraries import UI primitives only from `components`.
- ESLint rule `no-restricted-imports` rejects `@angular/material/*` imports outside `components`.
- Components public API is reviewed in `components/src/public-api.ts`; feature-specific components are not exported.

## API Library Enforcement

- `frontend/projects/api` exports TypeScript models for backend resources, service interfaces, and injection tokens.
- Concrete services live in `api` but are provided through tokens only.
- Feature tests use Angular `TestBed` providers to substitute mock implementations for every consumed API token.

## Backend CQRS Enforcement

- Controllers dispatch exactly one MediatR command/query and return the result.
- Commands/queries each have one request type, one response type, and one handler class.
- Architecture tests scan controllers for direct `DbContext`/repository/service composition and fail if found.

## E2E Page Object Model

Page objects live under `frontend/e2e/pages`:

- `AuthPages`
- `DashboardPage`
- `ContactsPage`
- `PartnersPage`
- `HackathonsPage`
- `TeamPage`
- `NotificationsPanel`
- `GlobalSearchOverlay`

Test files do not call `page.locator(...)` directly; selectors are encapsulated in page objects.

## Required E2E Flow Matrix

- registration and email verification
- sign-in and sign-out
- contact CRUD with notes
- partner CRUD with funnel stage change and notes
- hackathon CRUD with 4 D's stage change
- team member invite and role assignment
- dashboard widget add/move/remove
- realtime notification delivery between two simulated clients
- global search

## Viewport Matrix

Playwright projects:

| Project | Viewport | Required smoke flows |
|---|---:|---|
| `xs-mobile` | `375x667` | sign-in, contact create, partner create, dashboard widget add, global search |
| `md-tablet` | `768x1024` | sign-in, contact create, partner create, dashboard widget add, global search |
| `lg-desktop` | `1280x800` | sign-in, contact create, partner create, dashboard widget add, global search |

## Acceptance Tests

- L2-060: static import scan proves feature libs import UI components only from `components`.
- L2-061: feature unit tests replace API services via injection tokens without changing feature code.
- L2-062: backend architecture tests prove controller one-liners and command/query handler shape.
- L2-063: every major flow has at least one Playwright test with the required header comment and page object interactions.
- L2-064: required smoke flows pass on all three viewport projects.

## Radical Simplicity Notes

- Use static scans and lightweight architecture tests instead of a heavy architecture framework.
- Page objects are thin wrappers over user-visible labels and stable test IDs.
