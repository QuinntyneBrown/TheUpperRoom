# T63 — E2E acceptance flow inventory

**Status**: Complete
**Phase**: 10 — Component mapping and acceptance traceability
**Area**: QA, Architecture
**Requirements**: L2-063, L2-064
**Source**: Recommended Remediation Order — "acceptance-test flow inventory"

## Goal

Identify the primary flows the Playwright suite must cover and the responsive viewports each flow runs at, so design coverage and test coverage stay aligned.

## Scope

- List the major flows: register/verify/sign-in, password recovery, sign-out, contact create/edit/delete/search, partner create/stage-change/Kanban, hackathon create/stage/product, team invite/remove/role-change, dashboard add-widget/persist, global search, notification mark-as-read.
- For each: the screens involved, the responsive viewports required (per L2-064), and any state from this task pack the test must hit.
- Cross-reference each flow to the relevant T## tasks.

## Flow inventory

This document is the canonical map between user-facing flows, the design screens that compose them, and the Playwright tests that prove them. The QA team uses it to plan test coverage; designers use it to confirm every flow has design support.

### Viewports (per L2-064)

Every flow runs at a baseline of three viewports unless otherwise noted:

| Tag | Width × Height | Device class | Maps to designs |
|---|---|---|---|
| `vp-mobile` | 375 × 812 | iPhone-sized | `Mobile / *` frames |
| `vp-tablet` | 768 × 1024 | tablet portrait | `Tablet / *` frames where present, else collapsed-rail desktop |
| `vp-desktop` | 1440 × 900 | laptop | `Desktop / *` frames |

Some flows add a fourth `vp-desktop-wide` (1920 × 1080) when the design includes a wide-screen variant (e.g. dashboard widget grid).

### A. Authentication

#### A1 — Register · verify · sign-in
- **Screens**: `Desktop / Sign In`, `Desktop / Register`, `Desktop / Verify Email`, `Desktop / Sign In` (post-verify), Dashboard landing.
- **Viewports**: mobile, tablet, desktop.
- **States to hit**: empty form, validation errors, API error toast (T61), loading button state, success toast on landing.
- **Cross-references**: T01 (sign-in design system), T59 (focus), T60 (tab order on auth), T61 (form aria, live regions).

#### A2 — Sign-in · happy path
- **Screens**: `Desktop / Sign In` → Dashboard.
- **Viewports**: mobile, tablet, desktop.
- **States**: known-good credentials; "Remember me" toggle persisted across sessions.
- **Cross-references**: T01, T59.

#### A3 — Sign-in · failure paths
- **Screens**: `Desktop / Sign In` with `Input/Error` state; account-locked banner.
- **Viewports**: mobile, desktop.
- **States**: bad password, locked account, rate-limit, network error toast (assertive).
- **Cross-references**: T01, T61 (assertive live region).

#### A4 — Password recovery
- **Screens**: `Desktop / Forgot Password`, `Desktop / Reset Password`, `Desktop / Sign In`.
- **Viewports**: mobile, desktop.
- **States**: email submitted (success); reset token expired (error banner); new password mismatch (inline error).
- **Cross-references**: T01, T61.

#### A5 — Sign-out
- **Screens**: top-bar profile menu → `Desktop / Sign In`.
- **Viewports**: mobile, desktop.
- **States**: confirm dialog only when unsaved changes detected; otherwise immediate.
- **Cross-references**: T06 (modal pattern), T60 (focus return to sign-in input).

### B. Contacts

#### B1 — Contact create
- **Screens**: `Desktop / Contacts`, `Dialog / New Contact`, `Desktop / Contact Detail`.
- **Viewports**: mobile (sheet variant), tablet, desktop.
- **States**: empty, validation, server error, success toast, list-shows-new-row.
- **Cross-references**: T16 (responsive contacts), T17, T61.

#### B2 — Contact edit
- **Screens**: `Desktop / Contact Detail` (edit mode), `Dialog / Discard Changes?` (when navigating away dirty).
- **Viewports**: mobile, desktop.
- **States**: dirty form, save success, save error, discard-changes confirm.
- **Cross-references**: T16, T06.

#### B3 — Contact delete · restore
- **Screens**: `Desktop / Contact Detail`, `Dialog / Delete Contact`, `Dialog / Contact Audit Restore`.
- **Viewports**: mobile, desktop.
- **States**: confirm destructive (Cancel default-focused per T60), success toast with Undo, restore from audit.
- **Cross-references**: T41, T60.

#### B4 — Contact search
- **Screens**: `Desktop / Contacts` with search input.
- **Viewports**: mobile, desktop.
- **States**: empty query, debounced query, no results empty-state, highlighted matches.
- **Cross-references**: T30 (highlight token), T16.

### C. Partners

#### C1 — Partner create
- **Screens**: `Desktop / Partners`, `Dialog / New Partner`, `Desktop / Partner Detail`.
- **Viewports**: mobile, tablet, desktop.
- **States**: validation, success.
- **Cross-references**: T20, T61.

#### C2 — Partner stage change · Kanban
- **Screens**: `Desktop / Partners Board` (Kanban), `Dialog / Confirm Stage Advance`.
- **Viewports**: tablet, desktop. Mobile uses list view (T22).
- **States**: drag-and-drop (with keyboard equivalents per T60), confirm-on-significant-stage-change, optimistic update, rollback on server reject.
- **Cross-references**: T22 (board), T42 (stage filter), T11 (drag/keyboard), T60.

#### C3 — Partner stage filter
- **Screens**: `Desktop / Partners` with stage chips active.
- **Viewports**: mobile, desktop.
- **States**: single-select, multi-select, clear-all.
- **Cross-references**: T42, T62 (`<ur-filter-chip>`).

### D. Hackathons

#### D1 — Hackathon create
- **Screens**: `Desktop / Hackathons`, `Dialog / New Hackathon`, `Desktop / Hackathon Detail`.
- **Viewports**: mobile, tablet, desktop.
- **States**: validation, success.
- **Cross-references**: T43.

#### D2 — Hackathon list filter
- **Screens**: `Desktop / Hackathons`.
- **Viewports**: mobile, desktop.
- **Cross-references**: T43.

#### D3 — Hackathon update
- **Screens**: `Desktop / Hackathon Detail` (edit mode), `Dialog / Discard Changes?`.
- **Viewports**: mobile, desktop.
- **Cross-references**: T44.

#### D4 — Hackathon stage stepper
- **Screens**: `Desktop / Hackathon Detail - Stage Stepper`, `Dialog / Hackathon Stage - Advance`.
- **Viewports**: mobile, desktop.
- **States**: keyboard arrows, advance confirm, success toast, undo stage in 5s.
- **Cross-references**: T44, T60 (stage stepper keyboard).

#### D5 — Hackathon delete · restore
- **Screens**: `Desktop / Hackathon Detail`, `Dialog / Delete Hackathon`, `Dialog / Restore Hackathon`.
- **Viewports**: mobile, desktop.
- **Cross-references**: T45, T60.

### E. Team

#### E1 — Team invite
- **Screens**: `Desktop / Team`, `Dialog / Invite Member`.
- **Viewports**: mobile (sheet), tablet, desktop.
- **States**: pending invite row, resend, revoke, accepted (notification toast).
- **Cross-references**: T50, T52.

#### E2 — Team member remove
- **Screens**: `Desktop / Team`, `Dialog / Remove Member`.
- **Viewports**: mobile, desktop.
- **States**: confirm destructive, last-admin guard (T52), success.
- **Cross-references**: T52, T60.

#### E3 — Role change (Administrator grant / revoke)
- **Screens**: `Desktop / Administrators`, `Dialog / Confirm Role Change`.
- **Viewports**: mobile, desktop.
- **States**: confirm, last-administrator warning, audit row appended.
- **Cross-references**: T52.

#### E4 — Cross-team browse (restricted vs admin)
- **Screens**: `Desktop / Cross-team Partner - Restricted`, `Desktop / Cross-team Partner - Admin`, etc.
- **Viewports**: desktop.
- **States**: restricted public-safe view, admin override banner.
- **Cross-references**: T53 (hidden vs disabled standard).

### F. Dashboard

#### F1 — Dashboard add widget
- **Screens**: `Desktop / Dashboard - Empty First Widget`, `Dialog / Dashboard - Add Widget`, `Desktop / Dashboard - Widget Catalog`.
- **Viewports**: tablet, desktop, desktop-wide.
- **States**: empty (zero widgets), catalog filter, drag-to-grid, persist on reload.
- **Cross-references**: T46, T47, T11.

#### F2 — Dashboard drag · resize
- **Screens**: `Desktop / Dashboard - Drag Resize`.
- **Viewports**: desktop, desktop-wide.
- **States**: drag with pointer, drag with keyboard (Space → arrows → Space), resize, undo last layout change, reset layout (with confirm).
- **Cross-references**: T11, T48, T60.

#### F3 — Dashboard restore (last-write-wins)
- **Screens**: `Desktop / Dashboard - Restore LWW`.
- **Viewports**: desktop.
- **States**: conflict banner when remote layout newer than local, choose remote / keep local.
- **Cross-references**: T49.

### G. Real-time

#### G1 — SignalR lifecycle
- **Screens**: `Desktop / SignalR Connected/Reconnecting/Offline/RetryExhausted/Reconnected`.
- **Viewports**: mobile, desktop.
- **States**: each phase transition; manual reconnect; reload-page CTA.
- **Cross-references**: T50 (lifecycle), T54 (states), T18 (mobile).

#### G2 — Realtime latency harness
- **Screens**: dev-only `Desktop / Realtime Latency Harness`.
- **Viewports**: desktop.
- **States**: harness frame for QA only; not in production e2e.
- **Cross-references**: T52.

### H. Notifications

#### H1 — Mark as read · navigate
- **Screens**: `Desktop / Notification Row States`, `Desktop / Notification Center`.
- **Viewports**: mobile, desktop.
- **States**: unread → read transition (T56), keyboard M shortcut, click navigates to source.
- **Cross-references**: T56, T59, T60.

#### H2 — Mark all read
- **Screens**: `Desktop / Mark All Read - Optimistic`, `... - Undo Toast`, `Dialog / Confirm Mark All Read`, `... - Rollback`.
- **Viewports**: mobile (sheet), desktop.
- **States**: optimistic, undo within 5s, large-N confirm dialog, server rollback.
- **Cross-references**: T57, T60, T61.

#### H3 — Offline-delivered batch
- **Screens**: `Desktop / Notification Center - Offline-delivered group`, mobile variant.
- **Viewports**: mobile, desktop.
- **States**: "While you were away" group, per-item delivered-offline marker, reconnect toast with count.
- **Cross-references**: T55, T54.

### I. Global search

#### I1 — Global teams search
- **Screens**: `Desktop / Global Teams` with search.
- **Viewports**: mobile, desktop.
- **States**: min-length, loading, empty, error, highlighted matches.
- **Cross-references**: T51, T30, T17.

### J. Theme & accessibility regression

These are NOT user flows — they are sweeping checks the suite runs against representative pages.

#### J1 — Contrast audit
- **Screens**: every primary screen visited with axe-core; every token rendered against its surface validated.
- **Viewports**: desktop only (contrast is viewport-independent).
- **Cross-references**: T58.

#### J2 — Focus coverage
- **Screens**: tab through every primary screen and every dialog; assert ring visible on each focusable.
- **Viewports**: desktop, mobile (touch focus = no ring; pure keyboard via external kb).
- **Cross-references**: T59, T60.

#### J3 — Screen-reader smoke
- **Screens**: sign-in, contacts list, contact detail, dashboard, notifications, modal-with-form.
- **Viewports**: desktop.
- **States**: every aria role, label, and live-region announcement validated against expected transcript.
- **Cross-references**: T61.

### Coverage summary

| Phase | Flows | Cross-referenced tasks |
|---|---|---|
| Auth | A1–A5 | T01, T06, T59, T60, T61 |
| Contacts | B1–B4 | T16, T17, T30, T41, T60, T61, T06 |
| Partners | C1–C3 | T20, T22, T42, T11, T60, T62 |
| Hackathons | D1–D5 | T43, T44, T45, T60 |
| Team | E1–E4 | T50, T52, T53, T60 |
| Dashboard | F1–F3 | T46, T47, T48, T49, T11, T60 |
| Real-time | G1–G2 | T50, T52, T54, T18 |
| Notifications | H1–H3 | T54, T55, T56, T57, T59, T60, T61 |
| Search | I1 | T51, T30, T17 |
| A11y/Theme regression | J1–J3 | T58, T59, T60, T61 |

### Where this lives

This file IS the inventory. It sits alongside the specs in `docs/tasks/`. The Playwright test team consumes it directly; updates land here whenever a flow is added, retired, or its viewport coverage changes.

## Acceptance criteria

- [x] Flow inventory document written.
- [x] Each flow lists its screens, viewports, and referenced T## tasks.
- [x] Document lives alongside specs to be consumed by the test team.
