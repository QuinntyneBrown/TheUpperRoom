# UI Design Requirements Gap Audit

Date: 2026-05-04

Sources:
- `docs/ui-design.pen`
- `docs/specs/L1.md`
- `docs/specs/L2.md`

## Scope

This audit compares the static Pencil design in `docs/ui-design.pen` against the L1 and L2 requirements in `docs/specs`.

The design can demonstrate screens, flows, visual states, responsive variants, component coverage, theming, and some accessibility affordances. It cannot by itself prove backend behavior, API contracts, security controls, logging, performance budgets, SignalR delivery guarantees, or E2E test coverage. Those items are still listed as gaps when the design lacks the UI needed to expose or validate the requirement, and as implementation-only where the requirement is outside the scope of a design file.

## Design Inventory Observed

Top-level design frames:
- Design System
- Dialogs & States
- Desktop / Sign In
- Desktop / Dashboard
- Desktop / Partners
- Desktop / Partner Detail
- Desktop / Hackathons
- Desktop / Team
- Desktop / Notifications
- Desktop / Settings
- Mobile / Sign In
- Mobile / Dashboard
- Mobile / Partners
- Mobile / Partner Detail
- Mobile / Hackathons
- Tablet / Dashboard
- Tablet / Partners

Reusable components observed:
- Buttons: primary, secondary, outline, ghost, danger, icon, FAB
- Inputs: default, focused, error, disabled, search, textarea
- Presentation: card, badges, avatars, alerts, toast, side nav item, bottom nav item, list item

Notable design strengths:
- A coherent dark design system exists.
- Main navigation includes dashboard, partners, contacts, hackathons, team, prayer, cities, reports, and settings on several desktop screens.
- Partner list, partner detail, dashboard metrics, hackathon overview, local team, notification center, dialogs, empty states, loading states, and toasts are represented.
- Mobile variants exist for sign-in, dashboard, partners, partner detail, and hackathons.
- Tablet variants exist for dashboard and partners.

## Executive Summary

The design is a strong visual foundation for the product's core partner-management and dashboard experience, but it does not yet cover the full requirements set. The largest gaps are missing screens and flows for authentication, contacts, dashboard customization, global search, team administration, hackathon creation/product tracking, responsive coverage across every screen, and accessibility states.

The most critical mismatch is the hackathon process terminology. Requirements define the FaithTech 4 D's as Discover, Design, Develop, Deploy. The design shows Discover, Discern, Design, Deliver. Either the design or the requirements must be corrected before implementation.

The dashboard design conflicts with the configurable dashboard requirements. Requirements call for a newly registered user's dashboard to begin as an empty drop area with an "Add widget" call to action, plus a widget catalog, drag, resize, remove, persistence, and real-time chart refresh. The design shows a fixed pre-populated dashboard and static chart/card layout.

The dark theme is directionally aligned, but the palette is not strictly monochromatic. It includes prominent purple, magenta, cyan, green, yellow, red, and blue semantic colors. Several token combinations also miss the specified contrast thresholds, especially `fg-muted`, `fg-disabled`, and `accent-primary` on elevated surfaces.

Responsive coverage is partial. Several required screens have no mobile/tablet variants, and the Pencil layout snapshot reports clipping in the desktop dashboard activity region and tablet dashboard KPI area. The design does not yet prove coverage for all breakpoints called out in L2-039 through L2-041.

## Coverage Status Legend

| Status | Meaning |
| --- | --- |
| Covered | The design clearly represents the required UI surface or state. |
| Partial | The design contains some relevant UI but misses required fields, states, flows, or breakpoints. |
| Missing | No clear design coverage was found. |
| Implementation-only | The requirement cannot be satisfied by a static UI design alone. |
| Conflict | The design contradicts the requirement. |

## L1 Coverage Matrix

| Requirement | Status | Evidence | Main Gaps |
| --- | --- | --- | --- |
| L1-001 User Authentication | Partial | Desktop and mobile sign-in screens, "Forgot password?", "Request access" links. | No registration screen, email verification, password recovery flow, reset form, sign-out control, session expiry state, lockout/error states. |
| L1-002 Role-Based Authorization | Partial | Local team roles are shown; "Manage roles" exists. | No Administrator role UI, no role assignment flow, no access-denied screen, no permission-specific action states. |
| L1-003 Contact Management | Missing | Contacts appears in nav and partner detail associated-contact cards. | No contact list, create/edit/detail/delete/search/notes screens. |
| L1-004 Partner Management | Partial | Partner list, partner detail, add partner dialog, notes, associated contacts, filters. | No full create/edit/delete flow, no stage-change UI/history, no Kanban board, no association/removal flow, no validation states beyond generic component examples. |
| L1-005 Hackathon Management | Partial/Conflict | Desktop and mobile hackathon overview, partner sponsors, team cards. | 4 D labels conflict with spec; no create form, detail screen, product records, repository/demo URL fields, product team assignment, stage history. |
| L1-006 Team Management | Partial | Local team role cards, invite/manage buttons, global city summary card. | No invite form, remove member flow, role assignment/revocation UI, active status, pagination, global team detail, global team search, mobile team screen. |
| L1-007 Configurable Dashboard | Conflict | Dashboard metrics and chart cards exist. | Requirements call for empty default dashboard, draggable/resizable widgets, catalog, remove, persistence; design is fixed and pre-populated. |
| L1-008 Real-Time Updates and Notifications | Partial | Notification center, unread badge, toasts, reconnect toast. | No SignalR lifecycle state model, notification read/unread interaction details, offline delivery state, live in-place update UI. |
| L1-009 Responsive Mobile-First Design | Partial | Mobile variants for selected screens; tablet dashboard/partners. | Missing mobile/tablet variants for contacts, team, notifications, settings, global search, dialogs, dashboard editor, etc.; no proof for every breakpoint; clipping issues found. |
| L1-010 Dark Monochromatic Theming | Partial/Risk | Dark base theme and design tokens exist. | Palette includes several bright non-monochrome accents; some contrast ratios miss requirements. |
| L1-011 Cross-Entity Search | Partial | Search component exists; desktop partners top bar has search; mobile partners has search icon. | Search placeholder omits hackathons and team members; no global search results grouped by entity; no mobile full-screen search overlay. |
| L1-012 Logging and Observability | Implementation-only | Error toast examples exist. | No UI/logging contract artifacts; backend/frontend logging must be verified in implementation. |
| L1-013 Performance and Scalability | Implementation-only | Static design only. | No performance budgets, loading strategy, skeleton coverage across all primary screens, or scalability validation. |
| L1-014 Data Protection and Application Security | Implementation-only | Some form/error components exist. | Security controls are backend/frontend implementation work; design does not cover CSRF, rate limits, secrets, validation schemas, or secure session UX. |
| L1-015 Accessibility | Partial/Risk | Dark theme, components, focused input component. | No focus state coverage for every interactive element, no keyboard/focus-trap annotations, no ARIA/live-region design notes, contrast token failures. |
| L1-016 Reusable Component Library | Partial | Design system contains reusable presentation components. | Static design does not prove Angular Material wrapper library or import discipline. Missing some required reusable states such as dialogs/snackbars as formal components. |
| L1-017 API Contract and Decoupled Integration | Implementation-only | Not applicable to static UI. | Must be verified in frontend/backend architecture. |
| L1-018 End-to-End Test Coverage | Implementation-only | Not applicable to static UI. | Must be verified in Playwright suite and Page Object Model implementation. |

## Highest-Priority Gaps

### P0: Requirement Conflicts Or Core Missing Flows

1. Align hackathon 4 D terminology.
   - Requirement: L1-005, L2-023, L2-025.
   - Design currently shows: Discover, Discern, Design, Deliver.
   - Requirements specify: Discover, Design, Develop, Deploy.
   - Impact: This is a direct domain-model mismatch and will affect UI copy, data model values, tests, and training.

2. Add complete authentication flow screens.
   - Requirements: L2-001 through L2-005.
   - Missing: registration, email verification, password recovery request, password reset, unverified account message, invalid credentials message, lockout/throttle state, sign-out.
   - Current design only covers sign-in plus links for "Forgot password?" and "Request access".

3. Add the complete contacts module.
   - Requirements: L2-009 through L2-015.
   - Missing: contact list, create form, detail screen, edit form, delete confirmation, notes, contact-specific search, sorting, pagination, mobile card-list variant.
   - Current design only references contacts in navigation and within partner detail.

4. Redesign dashboard around configurable widgets.
   - Requirements: L2-032 through L2-035.
   - Missing: empty default dashboard, "Add widget" call to action, widget catalog, drag handles, resize handles, remove action, saved layout state, conflict handling, role-specific widget states.
   - Current design is a fixed metrics dashboard and conflicts with the default empty-dashboard requirement.

5. Add global search interaction and results.
   - Requirement: L2-043.
   - Missing: globally accessible search on every authenticated screen, grouped results for contacts/partners/hackathons/team members, navigation from result to detail, full-screen mobile search mode.
   - Current design's search component says "Search partners, contacts, notes..." and does not cover hackathons or team members.

6. Bring responsive coverage up to "every screen".
   - Requirements: L2-039 through L2-041, L2-064.
   - Missing: mobile/tablet variants for many primary and secondary screens, including contacts, team, notifications, settings, global search, auth recovery/registration, dashboard editor, dialogs, and partner board.
   - Snapshot issues: desktop dashboard activity region and tablet dashboard KPI area report partial clipping.

7. Address color and contrast risks.
   - Requirements: L1-010, L2-042, L2-059.
   - Risk: the design uses bright purple, magenta, cyan, green, yellow, red, and blue tokens within a requirement for a dark mostly monochromatic theme.
   - Measured token issues: `fg-muted` is below 4.5:1 against the main dark surfaces; `fg-disabled` is below 3:1; `accent-primary` is below 4.5:1 on several elevated/soft backgrounds.

### P1: Major Functional Coverage Gaps

1. Expand partner management.
   - Requirements: L2-016 through L2-021.
   - Add: edit partner, delete partner confirmation, stage-change control, stage history timeline, associated contact add/create/remove flow, note edit/delete permissions, website validation, mobile board/list states, desktop Kanban board.

2. Expand hackathon management.
   - Requirements: L2-022 through L2-025.
   - Add: create hackathon form, date validation, partner association flow, detail screen, stage history, product records, repository/demo URLs, builder assignment, collapsible mobile detail sections.

3. Expand team management.
   - Requirements: L2-026 through L2-031.
   - Add: team member invitation form, role assignment/revocation UI, remove member confirmation, active status, global teams list pagination, public summary vs Administrator detail, global team search, mobile team screen.

4. Complete notification behavior.
   - Requirements: L2-036 through L2-038.
   - Add: SignalR connected/reconnecting/offline states, persisted offline notifications, read/unread states per item, mark-all-read state transition, click-through destination previews, ARIA live-region behavior.

5. Add authorization and access-denied UI.
   - Requirements: L2-006 through L2-008.
   - Add: Administrator-specific screens, city-lead-limited controls, disabled/hidden unauthorized actions, 403/no-access route screen, cross-team restricted-state messaging.

### P2: Architecture, QA, And Operational Support

1. Link design system components to implementation architecture.
   - Requirements: L2-060.
   - Add: component inventory mapping to Angular Material wrappers, required states per component, usage guidance for feature teams.

2. Add implementation notes or non-visual artifacts for API/security/logging.
   - Requirements: L2-044 through L2-056, L2-061, L2-062.
   - The design cannot prove these, but UX flows should include structured validation errors, generic auth/security messages, retry/failure states, and privacy-safe logging/error text.

3. Add E2E acceptance traceability.
   - Requirements: L2-063, L2-064.
   - The design should identify primary flows and responsive screen variants that tests will cover, especially where UI states are not yet represented.

## Detailed L2 Coverage

### Authentication

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-001 User Registration | Missing | "Request access" link only. | No registration form with email, password, display name, city; no email verification pending/success screens; no password strength validation. |
| L2-002 User Sign-In | Partial | Desktop/mobile sign-in forms. | No invalid credential state, unverified account state, lockout state, redirect/loading state, or field validation. |
| L2-003 Password Recovery | Missing | "Forgot password?" link only. | No recovery request screen, generic confirmation, reset-password form, expired/used link state. |
| L2-004 Session Management | Implementation-only | None. | Cookie attributes and sliding expiration are backend/session concerns; design could add expired-session and re-auth states. |
| L2-005 User Sign-Out | Missing | No sign-out label/control found. | Need sign-out control and signed-out/redirect behavior in navigation or profile menu. |

### Authorization

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-006 Role Definitions and Assignment | Partial | Team screen shows City Lead, Prayer Lead, Event Lead, Communication Lead; "Manage roles" button. | Administrator role absent; no role assignment modal/flow; no allowed/forbidden role states. |
| L2-007 Endpoint Authorization Enforcement | Implementation-only/Partial | No access-denied screen not found. | Backend/route guard enforcement is implementation-only; UI still needs 401/403/no-access screens. |
| L2-008 Cross-Team Data Isolation | Implementation-only/Partial | "Cities and other teams" summary card exists. | No distinction between public summary and Administrator full detail; no cross-team restricted-state design. |

### Contact Management

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-009 Create Contact | Missing | Contacts nav item only. | No create-contact form or validation states. |
| L2-010 View Contact | Missing | Partner detail lists associated contacts. | No contact detail screen with metadata and notes. |
| L2-011 Update Contact | Missing | None. | No edit-contact flow or concurrency conflict state. |
| L2-012 Delete Contact | Missing | Generic delete note dialog only. | No contact delete confirmation, soft-delete/audit restore UI, or permission-specific states. |
| L2-013 Add and Edit Notes on Contact | Missing | Notes exist for partner detail only. | No contact note composer/list/edit/delete states. |
| L2-014 Search Contacts | Missing | Global/search component placeholder mentions contacts. | No contact-specific search results, snippets, highlighted matches, or minimum-length behavior. |
| L2-015 List and Paginate Contacts | Missing | Contacts nav item only. | No contact list, pagination, sorting, filtering, or mobile card list. |

### Partner Management

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-016 Create Partner Organization | Partial | Add partner dialog with organization name, city, website, status, first note. | Missing validation states for required fields and malformed URL; stage copy uses "Confirmed" instead of "Confirmed Partner" in some places. |
| L2-017 Move Partner Through Funnel Stages | Partial | List filters and status badges for Lead/In funnel/Confirmed; activity item says partner moved to Confirmed. | No explicit stage-change control; no chronological stage history; no SignalR update state. |
| L2-018 Associate Contacts with Partner | Partial | Partner detail shows contacts and "+ Add". | No add-existing-contact picker, create-new-contact-with-association flow, or remove-association action. |
| L2-019 Add Notes to Partner | Partial | Partner detail note composer and add-note dialog exist. | No 4000-character validation, edit/delete note states, author permission states, or server/client rejection states. |
| L2-020 View, Update, and Delete Partner | Partial | Partner detail shows name, website, city, status, contacts, notes, summary, owner, edit button. | Stage history absent; delete partner flow absent; associated contact detach behavior not represented. |
| L2-021 Filter Partners by Funnel Stage | Partial | Desktop tabs/filters and mobile list filters exist. | No desktop Kanban board; no mobile collapsed board with stage section headers; no multi-select filter state. |

### Hackathon Management

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-022 Create Hackathon | Missing | "+ Plan hackathon" button only. | No create form, date validation, partner association at creation. |
| L2-023 Track 4 D's Process Stage | Conflict/Partial | Desktop/mobile progress cards exist. | Stage labels conflict with spec; no advance/retreat control, no stage-history UI, no SignalR update state. |
| L2-024 Document Hackathon Products | Missing | Team cards show project names. | No product records with repository URL, demo URL, description, or team-member assignments as product data. |
| L2-025 View Hackathon Details | Partial/Conflict | Desktop/mobile hackathon overview includes dates, host city, sponsors, teams, progress. | No dedicated detail screen ordered products/partners/history; mobile lacks collapsible sections; 4 D conflict applies. |

### Team Management

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-026 View Local Team | Partial | Desktop team role cards with names/emails. | No active status; no sort evidence; no mobile team screen. |
| L2-027 Add Team Member | Missing/Partial | "+ Invite member" button. | No invitation form, role selection at invite time, invite-link completion states, or forbidden state for non-leads. |
| L2-028 Remove Team Member | Missing | None. | No remove action, confirmation, session-ended state, or protected higher-role rejection. |
| L2-029 Assign Team Role | Missing/Partial | "Manage roles" button. | No assign/revoke role UI or constraints. |
| L2-030 View Global Teams | Partial | "Cities and other teams" card with several city summaries. | No full global teams list, pagination, partner count, public summary detail, Administrator full detail. |
| L2-031 Search Global Teams | Missing | None. | No city/member search on global teams. |

### Dashboard

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-032 Default Dashboard Layout | Conflict | Pre-populated dashboard metrics/cards. | Requirement says new users see empty dashboard with "Add widget"; design does not show empty state. |
| L2-033 Add, Resize, and Reposition Widgets | Missing | Fixed cards only. | No widget catalog, drag handles, resize handles, remove controls, or layout persistence state. |
| L2-034 Real-Time Metric Charts | Partial | Static chart cards exist. | No Chart.js-specific behavior, real-time refresh state, touch data-point interactions, or SignalR-driven update state. |
| L2-035 Persisted Dashboard Layout per User | Implementation-only/Missing UI | None. | Persistence is implementation work; UI still needs customized/restored layout and conflict behavior. |

### Real-Time Updates And Notifications

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-036 Real-Time Connection Lifecycle | Partial | "Connection unstable" toast with reconnecting copy. | No connected/offline/retry-exhausted states; lifecycle behavior must be implemented. |
| L2-037 Push Notifications for Team Events | Partial | Notification list includes partner, follow-up, note, prayer, hackathon events. | No in-screen live update state, event payload representation, or multi-client behavior. |
| L2-038 Notification Center | Partial | Notification center panel, unread count, tabs, "Mark all read". | No read/unread item differentiation details, offline-delivered state, item click-through state, mark-all-read completion state. |

### Responsive Design

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-039 Extra-Small Viewport Layout | Partial | Mobile sign-in, dashboard, partners, partner detail, hackathons. | Missing mobile variants for contacts, team, notifications, settings, global search, partner board, dashboard editor, auth recovery/registration, etc. Hit target requirements not annotated. |
| L2-040 Small To Medium Viewport Layout | Partial | Tablet dashboard and partners exist. | Missing medium variants for detail screens and most list screens; no partner board three-column at >=768px. |
| L2-041 Large And Extra-Large Viewport Layout | Partial | Desktop frames are 1440px wide. | No explicit max-width behavior across >=1200px; dashboard grid does not show configurable 12-column widget layout. |

Additional layout concerns from `snapshot_layout(problemsOnly=true)`:
- `Desktop / Dashboard` has a partially clipped activity region.
- `Tablet / Dashboard` has a partially clipped KPI child.
- Sign-in background frames are partially clipped; these may be decorative, but should be verified.

### Theming

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-042 Default Dark Monochromatic Theme | Partial/Risk | Dark surfaces and tokens exist. | Palette includes non-monochrome accent/semantic colors; muted/disabled/accent token contrast falls below required thresholds in several combinations; chart colors need explicit monochrome-compliant treatment. |

Contrast risks measured from design tokens:
- `fg-muted` (`#71717A`) is 3.72 to 4.09 against main dark surfaces, below 4.5:1 for body text and below the 7:1 body-text target in L2-042.
- `fg-disabled` (`#52525B`) is 2.32 to 2.56 against main dark surfaces, below 3:1 for meaningful non-text UI.
- `accent-primary` (`#7C5CFF`) is below 4.5:1 on several elevated/soft surfaces.

### Search

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-043 Global Search Affordance | Partial | Search component and partner-screen search affordance. | No evidence search exists on every authenticated screen; placeholder excludes hackathons/team members; no grouped results; no mobile full-screen search overlay. |

### Logging And Observability

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-044 Backend Structured Logging | Implementation-only | None. | Backend logging cannot be proven in design. |
| L2-045 Frontend Logging | Implementation-only/Partial | Error toast examples. | Frontend error forwarding is implementation work; design can add generic failure and retry states, but does not prove logging. |

### Performance

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-046 Page Load Performance | Implementation-only/Partial | Loading state for partners. | No loading/skeleton states for every primary screen; budgets require implementation measurement. |
| L2-047 API Response Time | Implementation-only | None. | Backend performance cannot be proven in design. |
| L2-048 Real-Time Message Latency | Implementation-only | Notification/toast UI exists. | Latency budgets require SignalR implementation and tests. |

### Data Protection And Application Security

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-049 Encryption In Transit | Implementation-only | None. | TLS is deployment/backend configuration. |
| L2-050 Password Storage | Implementation-only | None. | Password hashing is backend implementation. |
| L2-051 Input Validation | Partial | Input error component exists; add partner fields exist. | No per-flow validation states for required fields, formats, note length, dates, or oversized input. |
| L2-052 Injection Prevention | Implementation-only | None. | Requires backend implementation, code review, and fuzzing. |
| L2-053 Output Encoding And XSS Prevention | Implementation-only/Partial | Notes are displayed as plain text visually. | Angular encoding behavior cannot be proven in design; no malicious-content display state. |
| L2-054 CSRF Protection | Implementation-only | None. | Backend/client security implementation. |
| L2-055 Rate Limiting | Implementation-only/Missing UI | None. | Need auth rate-limit/lockout messages in UI; enforcement is backend. |
| L2-056 Secrets Management | Implementation-only | None. | Build/runtime configuration concern. |

### Accessibility

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-057 Keyboard Navigation | Partial/Missing | Focused input component exists. | No focus rings shown across all controls; no tab-order annotations; no modal focus-trap/return-focus states. |
| L2-058 Screen Reader Support | Missing/Implementation-only | None. | No accessible names, semantic roles, alt text, or ARIA live-region annotations. |
| L2-059 Color Contrast | Partial/Risk | Dark palette exists. | Token contrast failures identified; semantic colors and chart colors need AA validation. |

### Component And API Architecture

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-060 Reusable Component Library | Partial | Reusable design components exist. | Does not prove Angular `components` library, Angular Material wrapping, exports, or feature import discipline. |
| L2-061 API Library With Injection Tokens | Implementation-only | None. | Requires code architecture. |
| L2-062 Backend CQRS With MediatR | Implementation-only | None. | Requires backend code architecture. |

### End-To-End Testing

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-063 Playwright E2E Coverage Of Major Flows | Implementation-only | None. | Requires tests; design currently lacks several major flows the tests must exercise. |
| L2-064 E2E Tests On Multiple Viewports | Implementation-only/Partial | Some mobile/tablet/desktop frames exist. | Missing design coverage for required smoke flows on all three viewport sizes, especially contact create, partner create, dashboard widget add, and global search. |

## Screen-Level Missing Inventory

The following required screens or states were not found in the current design:

- Registration form
- Email verification pending/success/expired states
- Password recovery request screen
- Password reset screen
- Sign-in invalid/unverified/locked-out states
- Sign-out control and signed-out state
- 401/403/no-access screen
- Contact list
- Contact create form
- Contact detail
- Contact edit form
- Contact delete confirmation
- Contact notes add/edit/delete states
- Contact search results with snippets/highlighting
- Partner edit form
- Partner delete confirmation
- Partner stage history
- Partner stage-change control
- Partner Kanban board
- Associate existing contact with partner
- Create contact from partner screen
- Remove contact association
- Hackathon create form
- Hackathon detail screen
- Hackathon stage history
- Hackathon product create/edit cards
- Product repository/demo URL fields
- Product builder assignment
- Team invite form
- Team remove member confirmation
- Team role assignment/revocation dialog
- Global teams list/detail/public/admin variants
- Global teams search
- Dashboard empty state
- Dashboard widget catalog
- Dashboard drag/resize/remove controls
- Dashboard layout persistence states
- Global search overlay and grouped results
- Mobile full-screen global search
- Mobile/tablet contacts, team, notifications, settings, dashboard editor, partner board, and auth recovery/registration variants
- Accessibility focus, keyboard, modal focus-trap, and screen-reader/live-region annotations

## Recommended Remediation Order

1. Resolve the hackathon 4 D terminology conflict.
2. Add missing auth and authorization screens.
3. Design the full contacts module.
4. Rework dashboard designs around configurable widgets and empty/default states.
5. Add global search flows across all required entity types.
6. Expand partner and hackathon management to include edit/delete/stage/product/history flows.
7. Add team administration and global team discovery/search flows.
8. Complete responsive variants for every primary screen and verify clipping issues.
9. Audit and adjust color tokens for WCAG contrast and the monochromatic-theme requirement.
10. Add accessibility annotations and visual states for keyboard focus, dialogs, live regions, and screen reader labels.
11. Map design components to the Angular component library and acceptance-test flow inventory.

