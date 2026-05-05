# UI Design Requirements Gap Audit

Date: 2026-05-04

Sources:
- `docs/ui-design.pen`
- `docs/specs/L1.md`
- `docs/specs/L2.md`
- Current `snapshot_layout(problemsOnly=true)` output for `docs/ui-design.pen`

## Scope

This audit compares the static Pencil design in `docs/ui-design.pen` against the L1 and L2 requirements in `docs/specs`.

The design can demonstrate screens, flows, visual states, responsive variants, component coverage, theming, and some accessibility affordances. It cannot by itself prove backend behavior, API contracts, security controls, logging, performance budgets, SignalR delivery guarantees, or E2E test coverage. Those items are still listed as gaps when the design lacks the UI needed to expose or validate the requirement, and as implementation-only where the requirement is outside the scope of a design file.

This revision reflects the later updates to `docs/ui-design.pen`. Recommendations that are now represented in the Pencil design have been removed or narrowed.

## Design Inventory Observed

Top-level design frames:
- Design System
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
- Dialogs & States
- Tablet / Dashboard
- Tablet / Partners
- Desktop / Dashboard - Empty
- Dialog / Widget Catalog
- Desktop / Register
- Desktop / Password Recovery
- Desktop / Password Reset
- Desktop / Access Denied
- Desktop / Contacts
- Desktop / Contact Detail
- Dialog / New Contact
- Dialog / Global Search

Reusable components observed:
- Buttons: primary, secondary, outline, ghost, danger, icon, FAB
- Inputs: default, focused, error, disabled, search, textarea
- Presentation: card, badges, avatars, alerts, toast, side nav item, bottom nav item, list item

Notable design strengths:
- A coherent dark design system exists.
- Main navigation includes dashboard, partners, contacts, hackathons, team, prayer, cities, reports, and settings on several desktop screens.
- The hackathon 4 D terminology is now aligned with the requirements: Discover, Design, Develop, Deploy.
- Desktop authentication coverage now includes registration, password recovery, password reset, and access-denied screens.
- Desktop contact coverage now includes a list, detail screen, new-contact dialog, contact notes, pagination, filtering, sorting, and a search affordance.
- The dashboard now includes an empty default state with an "Add widget" call to action and a widget catalog.
- A desktop global search dialog now shows grouped results for contacts, partners, hackathons, and team members.
- Partner list, partner detail, dashboard metrics, hackathon overview, local team, notification center, dialogs, empty states, loading states, and toasts are represented.
- Mobile variants exist for sign-in, dashboard, partners, partner detail, and hackathons.
- Tablet variants exist for dashboard and partners.

## Executive Summary

The updated design has closed several of the original audit's biggest visual-design gaps. Hackathon stage terminology is no longer a conflict. Registration, password recovery, password reset, access denied, desktop contacts, the dashboard empty state, the widget catalog, and a grouped global search dialog are now present.

The largest remaining gaps are now edge states, secondary flows, responsive coverage, and interaction detail. Authentication still lacks email verification states, sign-in error/lockout/unverified states, session-expired/re-auth states, and sign-out. Contacts now have a desktop happy path, but still lack edit/delete/restore flows, contact-specific search result snippets and highlighting, validation states, and mobile/tablet variants. The dashboard now starts correctly for a new user, but the design still does not show placed-widget editing, drag handles, resize handles, remove controls, saved/restored layouts, or conflict behavior.

Partner, hackathon, and team administration remain partially covered. The design still needs partner edit/delete/stage-history/Kanban flows, hackathon creation/detail/product/stage-history flows, and team invite/remove/role-assignment/global-team search flows.

The dark theme is directionally aligned, and the previously identified `fg-muted`, `fg-disabled`, and `accent-primary` contrast issues have mostly been corrected. The palette still includes prominent purple, magenta, cyan, green, yellow, red, and blue semantic colors, so it still needs a monochromatic-theme pass. `accent-primary-pressed` is below 4.5:1 on several dark surfaces if used for text, and chart/semantic colors still need explicit WCAG validation.

Responsive coverage remains partial. Several newly added desktop-only screens have no mobile or tablet variants. The current Pencil layout snapshot still reports clipping in the desktop dashboard activity region, tablet dashboard KPI area, desktop team email text, and widget catalog card descriptions. Decorative auth background shapes are also clipped; these may be intentional, but should be verified.

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
| L1-001 User Authentication | Partial | Desktop/mobile sign-in; desktop registration, password recovery, password reset. | No email verification states, invalid/unverified/lockout states, session-expired state, sign-out control, signed-out redirect state, or mobile variants for the new auth screens. |
| L1-002 Role-Based Authorization | Partial | Local team roles, "Manage roles", and desktop access-denied screen. | No full role assignment/revocation flow, no Administrator management view, no permission-specific disabled/hidden action states, no 401/session-expired state. |
| L1-003 Contact Management | Partial | Desktop contacts list, contact detail, new-contact dialog, notes, pagination, filters, sorting, search affordance. | No contact edit/delete/restore flows, no validation/error states, no contact-specific highlighted search results, no note edit/delete permission states, no mobile/tablet contact variants. |
| L1-004 Partner Management | Partial | Partner list, partner detail, add partner dialog, notes, associated contacts, filters. | No full edit/delete flow, no stage-change control/history, no Kanban board, no add-existing/create-and-associate/remove contact association flow, no validation states beyond generic component examples. |
| L1-005 Hackathon Management | Partial | Desktop and mobile hackathon overview, aligned 4 D labels, partner sponsors, team cards. | No create form, dedicated detail screen, product records, repository/demo URL fields, product team assignment, stage-change control, or stage history. |
| L1-006 Team Management | Partial | Local team role cards, invite/manage buttons, global city summary card. | No invite form, remove member flow, role assignment/revocation UI, active status, pagination, global team detail, global team search, or mobile team screen. |
| L1-007 Configurable Dashboard | Partial | Desktop empty dashboard, "Add widget" CTA, widget catalog, fixed populated dashboard metrics/charts. | No placed-widget editor state, drag handles, resize handles, remove action, saved/restored layout state, conflict handling, role-specific widget states, or mobile/tablet dashboard editor. |
| L1-008 Real-Time Updates and Notifications | Partial | Notification center, unread badge, toasts, reconnect toast. | No connected/offline/retry-exhausted lifecycle state model, read/unread item transition details, offline delivery state, or live in-place update UI. |
| L1-009 Responsive Mobile-First Design | Partial | Mobile variants for selected screens; tablet dashboard/partners. | Missing mobile/tablet variants for contacts, team, notifications, settings, global search, dialogs, dashboard editor, auth recovery/registration/reset, access denied, and partner board; current layout snapshot still reports clipping. |
| L1-010 Dark Monochromatic Theming | Partial/Risk | Dark base theme and updated design tokens exist. | Palette still uses several bright non-monochrome accent/semantic colors; `accent-primary-pressed`, chart colors, and semantic colors need explicit contrast validation. |
| L1-011 Cross-Entity Search | Partial | Search component and desktop global search dialog with grouped contact/partner/hackathon/team-member results. | No proof the global affordance exists on every authenticated screen, no mobile full-screen search overlay, no loading/error/minimum-length states, and no result navigation state beyond keyboard hints. |
| L1-012 Logging and Observability | Implementation-only | Error toast examples exist. | No UI/logging contract artifacts; backend/frontend logging must be verified in implementation. |
| L1-013 Performance and Scalability | Implementation-only | Static design only; partner loading state exists. | No performance budgets, loading/skeleton coverage across all primary screens, or scalability validation. |
| L1-014 Data Protection and Application Security | Implementation-only | Generic auth/recovery copy and some form/error components exist. | Security controls are backend/frontend implementation work; design does not cover rate-limit/lockout UX, validation schemas, CSRF, secrets, or secure session UX. |
| L1-015 Accessibility | Partial/Risk | Dark theme, components, focused input component, keyboard hints in global search. | No focus state coverage for every interactive element, no keyboard/focus-trap annotations, no ARIA/live-region design notes, and remaining color/semantic contrast risks. |
| L1-016 Reusable Component Library | Partial | Design system contains reusable presentation components. | Static design does not prove Angular Material wrapper implementation or import discipline. Dialog/snackbar usage still needs formal mapping to implementation components. |
| L1-017 API Contract and Decoupled Integration | Implementation-only | Not applicable to static UI. | Must be verified in frontend/backend architecture. |
| L1-018 End-to-End Test Coverage | Implementation-only | Not applicable to static UI. | Must be verified in Playwright suite and Page Object Model implementation. |

## Highest-Priority Gaps

### P0: Core Missing Flow Or Cross-Screen Coverage

1. Complete authentication and session edge states.
   - Requirements: L2-001 through L2-005.
   - Fixed since original audit: desktop registration, password recovery request, password reset.
   - Still missing: email verification pending/success/expired states, duplicate-registration generic confirmation, password-strength failure state, invalid credentials, unverified account, lockout/throttle state, redirect/loading state, expired-session/re-auth state, sign-out control, and signed-out redirect behavior.

2. Finish the configurable dashboard interaction model.
   - Requirements: L2-032 through L2-035.
   - Fixed since original audit: desktop empty dashboard state, "Add widget" CTA, widget catalog.
   - Still missing: visible placed-widget editor state, drag handles, resize handles, remove action, layout save/restored state, conflict handling, responsive dashboard editor, 12-column large-screen behavior, real-time chart refresh states, and touch chart interactions.

3. Bring responsive coverage up to "every screen".
   - Requirements: L2-039 through L2-041, L2-064.
   - Still missing: mobile/tablet variants for contacts, team, notifications, settings, global search, dialogs, dashboard editor, auth recovery/registration/reset, access denied, and partner board.
   - Current snapshot issues: desktop dashboard activity region, desktop team email text, tablet dashboard KPI card, and widget catalog card descriptions are partially clipped. Decorative auth background shapes are clipped and should be verified as intentional.

4. Complete partner and hackathon operational flows.
   - Requirements: L2-016 through L2-025.
   - Fixed since original audit: hackathon 4 D labels now match Discover, Design, Develop, Deploy.
   - Still missing: partner edit/delete, stage-change control, stage history timeline, desktop/mobile Kanban board, associated contact add/create/remove flows, hackathon create form, hackathon detail screen, hackathon product records, repository/demo URLs, product team assignment, and hackathon stage history/control.

5. Address theme and accessibility risks together.
   - Requirements: L1-010, L1-015, L2-042, L2-057 through L2-059.
   - Fixed since original audit: main muted/disabled/accent token contrast has been improved.
   - Still missing: a strict monochromatic palette decision for accent/semantic/chart colors, validation of `accent-primary-pressed`, complete focus states, modal focus-trap/return-focus annotations, accessible names, and live-region behavior for toasts/notifications.

### P1: Major Functional Coverage Gaps

1. Complete contact lifecycle coverage beyond the desktop happy path.
   - Requirements: L2-009 through L2-015.
   - Fixed since original audit: desktop list, detail, create dialog, notes composer/list, pagination, filters, sorting, search affordance.
   - Add: edit form, concurrency conflict state, delete confirmation, audit/restore state, field validation states, note edit/delete permission states, contact-specific search results with snippets/highlighting, minimum-length behavior, and mobile/tablet contact variants.

2. Expand team management.
   - Requirements: L2-026 through L2-031.
   - Add: team member invitation form, role assignment/revocation UI, remove member confirmation, active status, global teams list pagination, public summary vs Administrator detail, global team search, and mobile team screen.

3. Complete notification behavior.
   - Requirements: L2-036 through L2-038.
   - Add: SignalR connected/reconnecting/offline/retry-exhausted states, persisted offline notifications, read/unread states per item, mark-all-read state transition, click-through destination previews, and ARIA live-region behavior.

4. Add authorization variants beyond the 403 screen.
   - Requirements: L2-006 through L2-008.
   - Add: Administrator-specific screens, City Lead-limited controls, disabled/hidden unauthorized actions, 401/session-expired state, and cross-team restricted-state messaging.

5. Add per-flow validation and failure states.
   - Requirements: L2-051, L2-055, plus relevant feature requirements.
   - Add: required-field, malformed email/phone/URL, date-range, oversized note/input, rate-limit/lockout, duplicate-safe auth copy, server rejection, retry, and conflict states on the actual feature screens.

### P2: Architecture, QA, And Operational Support

1. Link design system components to implementation architecture.
   - Requirements: L2-060.
   - Add: component inventory mapping to Angular Material wrappers, required states per component, and usage guidance for feature teams.

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
| L2-001 User Registration | Partial | Desktop / Register includes display name, email, city, password, strength guidance, and create-account action. | No email verification pending/success/expired states; no duplicate-email generic confirmation state; no field-level password failure state; no mobile registration variant. |
| L2-002 User Sign-In | Partial | Desktop/mobile sign-in forms. | No invalid credential state, unverified account state, lockout state, redirect/loading state, or field validation. |
| L2-003 Password Recovery | Partial | Desktop / Password Recovery and Desktop / Password Reset now exist with generic recovery copy and reset fields. | No post-submit sent-confirmation state, expired/already-used link state, forced re-sign-in state after reset, or mobile recovery/reset variants. |
| L2-004 Session Management | Implementation-only/Partial | None. | Cookie attributes and sliding expiration are backend/session concerns; design still needs expired-session and re-auth states. |
| L2-005 User Sign-Out | Missing | No sign-out label/control found. | Need sign-out control and signed-out/redirect behavior in navigation or profile menu. |

### Authorization

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-006 Role Definitions and Assignment | Partial | Team screen shows City Lead, Prayer Lead, Event Lead, Communication Lead; "Manage roles" button; access-denied copy references Administrator. | No Administrator management UI; no role assignment/revocation modal/flow; no allowed/forbidden role states. |
| L2-007 Endpoint Authorization Enforcement | Implementation-only/Partial | Desktop / Access Denied shows a 403/no-permission state. | Backend/route guard enforcement is implementation-only; UI still needs 401/session-expired state and route-guard loading/redirect behavior. |
| L2-008 Cross-Team Data Isolation | Implementation-only/Partial | "Cities and other teams" summary card exists. | No distinction between public summary and Administrator full detail; no cross-team restricted-state design. |

### Contact Management

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-009 Create Contact | Partial | Dialog / New Contact has full name, email, phone, role, optional partner, required marker, cancel/create actions. | Spec requires first name and last name; current dialog uses one full-name field. City and free-form notes are not represented in the create dialog; no validation/error states; no mobile create variant. |
| L2-010 View Contact | Partial | Desktop / Contact Detail shows contact name, role/partner, email, phone, city, associated partner, notes, note authors, and note dates. | Missing created/updated metadata and created-by display; no cross-team not-found state; no mobile single-column contact detail. |
| L2-011 Update Contact | Missing/Partial | Contact detail has an Edit button. | No edit-contact form, save state, validation state, or concurrency conflict state. |
| L2-012 Delete Contact | Missing | Generic delete note dialog only. | No contact delete confirmation, soft-delete/audit restore UI, or permission-specific states. |
| L2-013 Add and Edit Notes on Contact | Partial | Contact detail has note tabs, composer, 0/4000 counter, Add note action, and note list. | No edit/delete note states, author permission states, over-limit validation, or server/client rejection states. |
| L2-014 Search Contacts | Partial | Contacts list includes a search component; global search returns contact results. | No contact-specific result snippets/highlighting, no minimum-length behavior, no empty/loading/error search states. |
| L2-015 List and Paginate Contacts | Partial | Desktop / Contacts shows list/table, filters, sort control, and pagination. | No sortable column toggle states; no mobile card list; no collapsed mobile sort/filter controls. |

### Partner Management

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-016 Create Partner Organization | Partial | Add partner dialog with organization name, city, website, status, first note. | Missing validation states for required fields and malformed URL; stage copy is abbreviated as "Confirmed" in some places rather than "Confirmed Partner." |
| L2-017 Move Partner Through Funnel Stages | Partial | List filters and status badges for Lead/In funnel/Confirmed; activity item says partner moved to Confirmed. | No explicit stage-change control; no chronological stage history; no SignalR update state. |
| L2-018 Associate Contacts with Partner | Partial | Partner detail shows contacts and "+ Add"; New Contact dialog supports optional partner. | No partner-context add-existing-contact picker, create-new-contact-with-association flow, or remove-association action. |
| L2-019 Add Notes to Partner | Partial | Partner detail note composer and add-note dialog exist; generic delete note dialog exists. | No 4000-character validation on partner notes, edit/delete permission states, or server/client rejection states. |
| L2-020 View, Update, and Delete Partner | Partial | Partner detail shows name, website, city, status, contacts, notes, summary, owner, edit button. | Stage history absent; edit form absent; delete partner flow absent; associated contact detach behavior not represented. |
| L2-021 Filter Partners by Funnel Stage | Partial | Desktop tabs/filters and mobile list filters exist. | No desktop Kanban board; no mobile collapsed board with stage section headers; no multi-select filter state. |

### Hackathon Management

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-022 Create Hackathon | Missing | "+ Plan hackathon" button only. | No create form, date validation, or partner association at creation. |
| L2-023 Track 4 D's Process Stage | Partial | Desktop/mobile progress cards use Discover, Design, Develop, Deploy. | No advance/retreat control, no stage-history UI, no SignalR update state. |
| L2-024 Document Hackathon Products | Missing/Partial | Team cards show project names. | No product records with repository URL, demo URL, description, or team-member assignments as product data. |
| L2-025 View Hackathon Details | Partial | Desktop/mobile hackathon overview includes dates, host city, sponsors, teams, and 4 D progress. | No dedicated detail screen with ordered products/partners/history; mobile lacks collapsible detail sections. |

### Team Management

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-026 View Local Team | Partial | Desktop team role cards with names/emails. | No active status; no sort evidence; no mobile team screen. Current snapshot reports one team email line is clipped. |
| L2-027 Add Team Member | Missing/Partial | "+ Invite member" button. | No invitation form, role selection at invite time, invite-link completion states, or forbidden state for non-leads. |
| L2-028 Remove Team Member | Missing | None. | No remove action, confirmation, session-ended state, or protected higher-role rejection. |
| L2-029 Assign Team Role | Missing/Partial | "Manage roles" button. | No assign/revoke role UI or constraints. |
| L2-030 View Global Teams | Partial | "Cities and other teams" card with several city summaries. | No full global teams list, pagination, partner count, public summary detail, Administrator full detail. |
| L2-031 Search Global Teams | Missing/Partial | Global search dialog includes a team-members section, but not global team/city search. | No city/member search on global teams. |

### Dashboard

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-032 Default Dashboard Layout | Covered/Partial | Desktop / Dashboard - Empty shows empty dashboard, "Add widget", and empty drop area. | Desktop default state is represented; mobile/tablet empty dashboard variants are not shown. |
| L2-033 Add, Resize, and Reposition Widgets | Partial | Empty dashboard copy references drag/rearrange/resize; Dialog / Widget Catalog exists. | No placed-widget editor state, drag handles, resize handles, remove controls, save state, or layout persistence state. |
| L2-034 Real-Time Metric Charts | Partial | Static chart cards exist. | No Chart.js-specific behavior, real-time refresh state, touch data-point interactions, or SignalR-driven update state. |
| L2-035 Persisted Dashboard Layout per User | Implementation-only/Partial UI | Empty dashboard and widget catalog imply customization. | Persistence is implementation work; UI still needs customized/restored layout and conflict behavior. |

### Real-Time Updates And Notifications

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-036 Real-Time Connection Lifecycle | Partial | "Connection unstable" toast with reconnecting copy. | No connected/offline/retry-exhausted states; lifecycle behavior must be implemented. |
| L2-037 Push Notifications for Team Events | Partial | Notification list includes partner, follow-up, note, prayer, hackathon events. | No in-screen live update state, event payload representation, or multi-client behavior. |
| L2-038 Notification Center | Partial | Notification center panel, unread count, tabs, "Mark all read". | No read/unread item differentiation details, offline-delivered state, item click-through state, mark-all-read completion state. |

### Responsive Design

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-039 Extra-Small Viewport Layout | Partial | Mobile sign-in, dashboard, partners, partner detail, hackathons. | Missing mobile variants for contacts, team, notifications, settings, global search, partner board, dashboard editor, auth recovery/registration/reset, access denied, and widget catalog. Hit target requirements not annotated. |
| L2-040 Small To Medium Viewport Layout | Partial | Tablet dashboard and partners exist. | Missing medium variants for contact screens, auth recovery/registration/reset, access denied, global search, detail screens, team, notifications, settings, and most list screens; no partner board three-column at >=768px. |
| L2-041 Large And Extra-Large Viewport Layout | Partial | Desktop frames are 1440px wide. | No explicit max-width behavior across >=1200px; dashboard editor does not show configurable 12-column widget layout. |

Current layout concerns from `snapshot_layout(problemsOnly=true)`:
- `Desktop / Dashboard` still has a partially clipped activity region.
- `Tablet / Dashboard` still has a partially clipped KPI card.
- `Desktop / Team` has a partially clipped email text line.
- `Dialog / Widget Catalog` has partially clipped description text in several widget cards.
- Decorative auth background frames are partially clipped on sign-in/register/recovery/reset/access-denied screens; these may be intentional, but should be verified.

### Theming

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-042 Default Dark Monochromatic Theme | Partial/Risk | Dark surfaces and updated tokens exist. | Palette includes non-monochrome accent/semantic colors; chart colors need explicit monochrome-compliant treatment and contrast validation. |

Updated contrast observations from design tokens:
- `fg-muted` is now `#A8A8B5` and measures roughly 6.92 to 8.40 against core dark surfaces, resolving the original low-contrast finding for most uses.
- `fg-disabled` is now `#7A7A87` and measures roughly 3.84 to 4.67 against core dark surfaces, resolving the original non-text contrast issue; it should not be used for required body copy on darker elevated states without validation.
- `accent-primary` is now `#9F86FF` and measures roughly 5.68 to 6.89 against core dark surfaces, resolving the original AA text contrast issue.
- `accent-primary-pressed` remains `#7C5CFF` and measures roughly 3.74 to 4.54 against core dark surfaces and 4.06 against `accent-soft`; do not use it for normal text without an alternate foreground/background pairing.

Remaining theme risks:
- Accent and semantic colors still include purple, magenta, cyan, green, yellow, red, and blue.
- Chart series, focus indicators, semantic badges, and live notification accents need explicit contrast and monochromatic-theme validation.

### Search

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-043 Global Search Affordance | Partial | Dialog / Global Search shows grouped contacts, partners, hackathons, and team-member results with keyboard hints. | No evidence search exists on every authenticated screen; no mobile full-screen search overlay; no loading/error/minimum-length states; result navigation is hinted but not shown as a state. |

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
| L2-051 Input Validation | Partial | Input error component, password strength guidance, generic recovery copy, and note character counter exist. | No per-flow validation states for required fields, malformed contact/partner fields, note length, hackathon dates, oversized input, or server/client rejection. |
| L2-052 Injection Prevention | Implementation-only | None. | Requires backend implementation, code review, and fuzzing. |
| L2-053 Output Encoding And XSS Prevention | Implementation-only/Partial | Notes are displayed as plain text visually. | Angular encoding behavior cannot be proven in design; no malicious-content display state. |
| L2-054 CSRF Protection | Implementation-only | None. | Backend/client security implementation. |
| L2-055 Rate Limiting | Implementation-only/Missing UI | None. | Need auth rate-limit/lockout messages in UI; enforcement is backend. |
| L2-056 Secrets Management | Implementation-only | None. | Build/runtime configuration concern. |

### Accessibility

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-057 Keyboard Navigation | Partial/Missing | Focused input component exists; global search includes keyboard hints. | No focus rings shown across all controls; no tab-order annotations; no modal focus-trap/return-focus states. |
| L2-058 Screen Reader Support | Missing/Implementation-only | None. | No accessible names, semantic roles, alt text, or ARIA live-region annotations. |
| L2-059 Color Contrast | Partial/Risk | Dark palette and updated contrast tokens exist. | `accent-primary-pressed`, semantic colors, chart colors, focus rings, and meaningful non-text states need AA validation. |

### Component And API Architecture

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-060 Reusable Component Library | Partial | Reusable design components exist. | Design does not prove Angular `components` library usage, Angular Material wrapping, exports, or feature import discipline. |
| L2-061 API Library With Injection Tokens | Implementation-only | None. | Requires code architecture. |
| L2-062 Backend CQRS With MediatR | Implementation-only | None. | Requires backend code architecture. |

### End-To-End Testing

| Requirement | Status | Design Evidence | Gap |
| --- | --- | --- | --- |
| L2-063 Playwright E2E Coverage Of Major Flows | Implementation-only | None. | Requires tests; design still lacks several major flows the tests must exercise. |
| L2-064 E2E Tests On Multiple Viewports | Implementation-only/Partial | Some mobile/tablet/desktop frames exist. | Missing design coverage for required smoke flows on all three viewport sizes, especially contact create, partner create, dashboard widget add, and global search. |

## Screen-Level Missing Inventory

The following required screens or states were not found in the current design:

- Email verification pending/success/expired states
- Registration duplicate-email generic confirmation and password failure states
- Password recovery sent-confirmation and expired/already-used link states
- Sign-in invalid/unverified/locked-out/loading states
- Session-expired/re-auth state
- Sign-out control and signed-out redirect state
- 401 unauthenticated state
- Role assignment/revocation dialog
- Administrator role management view
- Cross-team restricted/public/admin variants
- Contact edit form
- Contact concurrency conflict state
- Contact delete confirmation
- Contact audit/restore state
- Contact validation states for malformed email/phone and missing required fields
- Contact notes edit/delete/permission/over-limit states
- Contact-specific search results with snippets/highlighting
- Contact search minimum-length/loading/empty/error states
- Mobile/tablet contact list, detail, and create variants
- Partner edit form
- Partner delete confirmation
- Partner stage history
- Partner stage-change control
- Partner Kanban board
- Associate existing contact with partner
- Create contact from partner screen
- Remove contact association
- Partner validation and permission-specific states
- Hackathon create form
- Hackathon detail screen
- Hackathon stage history
- Hackathon stage advance/retreat control
- Hackathon product create/edit cards
- Product repository/demo URL fields
- Product builder assignment
- Team invite form
- Team remove member confirmation
- Team role assignment/revocation dialog
- Global teams list/detail/public/admin variants
- Global teams search
- Dashboard placed-widget editor state
- Dashboard drag/resize/remove controls
- Dashboard saved/restored/conflict states
- Mobile/tablet dashboard editor variants
- SignalR connected/offline/retry-exhausted states
- Offline-delivered notification state
- Notification read/unread transition states
- Mark-all-read completion state
- Mobile full-screen global search
- Global search loading/error/minimum-length states
- Global search result navigation state
- Mobile/tablet notifications, settings, team, dialogs, auth recovery/registration/reset, access denied, global search, and partner board variants
- Layout fixes or verification for current clipped dashboard, team, widget catalog, tablet dashboard, and decorative auth elements
- Accessibility focus, keyboard, modal focus-trap, and screen-reader/live-region annotations
- Monochromatic chart/semantic/focus color validation

## Recommended Remediation Order

1. Complete auth/session edge states and sign-out, then add mobile variants for registration, recovery, reset, and access denied.
2. Finish the dashboard editor interaction model: placed widget state, drag/resize/remove controls, saved/restored layout, conflict state, responsive editor, and chart touch/real-time states.
3. Complete responsive variants for contacts, team, notifications, settings, global search, dialogs, auth screens, dashboard editor, and partner board; fix or verify the current clipping findings.
4. Complete the contact lifecycle: edit, delete, restore, validation, note permissions, contact-specific search highlighting, and mobile/tablet variants.
5. Expand partner and hackathon management to include edit/delete/stage/product/history flows, partner Kanban, and association management.
6. Add team administration, role assignment/revocation, global team discovery/search, and authorization variants.
7. Complete notification and real-time lifecycle behavior, including offline delivery and read/unread transitions.
8. Audit and adjust accent, semantic, chart, focus, and pressed-state colors for WCAG contrast and the monochromatic-theme requirement.
9. Add accessibility annotations and visual states for keyboard focus, dialogs, live regions, and screen reader labels.
10. Map design components to the Angular component library and acceptance-test flow inventory.
