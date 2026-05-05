# UI Design Remediation Tasks

Generated from `docs/ui-design-requirements-gap-audit.md` on 2026-05-04.

Each task addresses a specific screen, state, or behavior missing from `docs/ui-design.pen`. Tasks are grouped by the audit's Recommended Remediation Order. Within a phase, tasks may be worked in parallel.

## Phase 1 — Authentication and session edge states

- [T01 — Email verification states](T01-auth-email-verification-states.md)
- [T02 — Registration error and duplicate-email states](T02-auth-registration-error-states.md)
- [T03 — Password recovery sent-confirmation state](T03-auth-password-recovery-sent-state.md)
- [T04 — Password reset expired/used link state](T04-auth-password-reset-expired-link-state.md)
- [T05 — Sign-in invalid/unverified/locked/loading states](T05-auth-signin-error-states.md)
- [T06 — Session-expired and re-authentication state](T06-auth-session-expired-reauth.md)
- [T07 — Sign-out control and signed-out redirect](T07-auth-signout-control.md)
- [T08 — 401 unauthenticated state](T08-auth-401-unauthenticated.md)
- [T09 — Mobile variants for registration, recovery, reset, access denied](T09-auth-mobile-variants.md)

## Phase 2 — Dashboard editor interaction model

- [T10 — Placed-widget editor state](T10-dashboard-placed-widget-editor.md)
- [T11 — Drag/resize/remove widget controls](T11-dashboard-drag-resize-remove-controls.md)
- [T12 — Saved, restored, and conflict layout states](T12-dashboard-saved-restored-conflict.md)
- [T13 — Real-time chart refresh states](T13-dashboard-real-time-chart-states.md)
- [T14 — Touch chart interactions](T14-dashboard-touch-chart-interactions.md)
- [T15 — Mobile and tablet dashboard editor](T15-dashboard-mobile-tablet-editor.md)

## Phase 3 — Responsive coverage and clipping fixes

- [T16 — Mobile and tablet contact variants](T16-responsive-contacts-mobile-tablet.md)
- [T17 — Mobile team screen](T17-responsive-team-mobile.md)
- [T18 — Mobile and tablet notifications](T18-responsive-notifications-mobile-tablet.md)
- [T19 — Mobile and tablet settings](T19-responsive-settings-mobile-tablet.md)
- [T20 — Mobile full-screen global search](T20-responsive-global-search-mobile.md)
- [T21 — Mobile dialog variants](T21-responsive-dialogs-mobile.md)
- [T22 — Partner board responsive variants](T22-responsive-partner-board.md)
- [T23 — Layout clipping fixes and verification](T23-responsive-clipping-fixes.md)

## Phase 4 — Contact lifecycle

- [T24 — Contact edit form](T24-contact-edit-form.md)
- [T25 — Contact delete confirmation](T25-contact-delete-confirmation.md)
- [T26 — Contact concurrency conflict state](T26-contact-concurrency-conflict.md)
- [T27 — Contact audit and restore state](T27-contact-audit-restore.md)
- [T28 — Contact validation states](T28-contact-validation-states.md)
- [T29 — Contact notes permission and over-limit states](T29-contact-notes-permission-states.md)
- [T30 — Contact-specific search results with highlighting](T30-contact-search-results-highlighting.md)
- [T31 — Contact search loading/empty/error states](T31-contact-search-states.md)

## Phase 5 — Partner and hackathon management

- [T32 — Partner edit form](T32-partner-edit-form.md)
- [T33 — Partner delete confirmation](T33-partner-delete-confirmation.md)
- [T34 — Partner stage-change control](T34-partner-stage-change-control.md)
- [T35 — Partner stage history](T35-partner-stage-history.md)
- [T36 — Partner Kanban board](T36-partner-kanban-board.md)
- [T37 — Associate existing contact with partner](T37-partner-associate-existing-contact.md)
- [T38 — Create-and-associate contact from partner](T38-partner-create-contact-with-association.md)
- [T39 — Remove contact association](T39-partner-remove-contact-association.md)
- [T40 — Partner validation and permission states](T40-partner-validation-permission-states.md)
- [T41 — Hackathon create form](T41-hackathon-create-form.md)
- [T42 — Hackathon detail screen](T42-hackathon-detail-screen.md)
- [T43 — Hackathon stage advance/retreat control](T43-hackathon-stage-control.md)
- [T44 — Hackathon stage history](T44-hackathon-stage-history.md)
- [T45 — Hackathon product create/edit cards](T45-hackathon-product-cards.md)
- [T46 — Hackathon product team assignment](T46-hackathon-product-team-assignment.md)

## Phase 6 — Team administration and authorization

- [T47 — Team invite form](T47-team-invite-form.md)
- [T48 — Team remove member confirmation](T48-team-remove-confirmation.md)
- [T49 — Team role assignment/revocation dialog](T49-team-role-assignment-dialog.md)
- [T50 — Global teams list, detail, public/admin variants](T50-team-global-list-variants.md)
- [T51 — Global teams search](T51-team-global-search.md)
- [T52 — Administrator role management view](T52-authz-administrator-management.md)
- [T53 — Cross-team restricted/public/admin variants](T53-authz-cross-team-variants.md)

## Phase 7 — Notifications and real-time lifecycle

- [T54 — SignalR connected/offline/retry-exhausted states](T54-notifications-signalr-states.md)
- [T55 — Offline-delivered notification state](T55-notifications-offline-delivered.md)
- [T56 — Notification read/unread transitions](T56-notifications-read-unread-transitions.md)
- [T57 — Mark-all-read completion state](T57-notifications-mark-all-read.md)

## Phase 8 — Theme and contrast audit

- [T58 — Monochromatic accent/semantic/chart/focus color audit](T58-theme-monochromatic-color-audit.md)

## Phase 9 — Accessibility annotations

- [T59 — Focus state coverage](T59-accessibility-focus-states.md)
- [T60 — Keyboard navigation and modal focus trap](T60-accessibility-keyboard-focus-trap.md)
- [T61 — Screen reader and live-region annotations](T61-accessibility-screen-reader-annotations.md)

## Phase 10 — Component mapping and acceptance traceability

- [T62 — Map design components to Angular Material wrappers](T62-component-library-mapping.md)
- [T63 — E2E acceptance flow inventory](T63-e2e-acceptance-flow-inventory.md)
