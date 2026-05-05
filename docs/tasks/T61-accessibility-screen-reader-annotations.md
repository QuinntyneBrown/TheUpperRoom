# T61 — Screen reader and live-region annotations

**Status**: Complete
**Phase**: 9 — Accessibility annotations
**Area**: Accessibility
**Requirements**: L1-015, L2-058
**Source**: Screen-Level Missing Inventory — "screen-reader/live-region annotations"

## Goal

Add accessible-name, role, and ARIA live-region annotations to the design so the implementation team has explicit guidance.

## Scope

- Accessible names for icon-only buttons (search, close, more).
- Roles for custom widgets (tablist, listbox, dialog, alert, status).
- Live regions: notification toasts (assertive vs. polite), reconnect banner, mark-all-read snackbar.
- Alt text for decorative vs. meaningful imagery (decorative auth shapes are decorative).
- Form-field labels and described-by associations for inline errors.

## Design notes

### Icon-only button accessible names

Every icon-only button (no visible text label) must carry an `aria-label`. The visible tooltip text and the `aria-label` must match exactly so SR users and sighted users learn the same name.

| Component / surface | Visible icon | `aria-label` |
|---|---|---|
| Top bar — search | `search` | `Search` |
| Top bar — notifications | `bell` | `Notifications` (with badge: `Notifications, 3 unread`) |
| Top bar — profile | avatar | `Account menu, signed in as {name}` |
| Top bar — live indicator | `circle` (decorative dot + "LIVE") | `aria-hidden="true"` (status conveyed via the hidden `Live updates connected` text in `<span class="sr-only">`) |
| Side-nav — collapse toggle | `chevrons-left` / `chevrons-right` | `Collapse navigation` / `Expand navigation` |
| Card / row — overflow menu | `ellipsis` | `More actions for {entity name}` |
| Card / row — favorite | `star` | `Favorite {entity name}` (toggled to `Unfavorite {entity name}`) |
| Modal — close | `x` | `Close dialog` |
| Toast — dismiss | `x` | `Dismiss notification` |
| Banner — dismiss | `x` | `Dismiss banner` |
| Input — clear | `x` | `Clear {field name}` |
| Input — show password | `eye` / `eye-off` | `Show password` / `Hide password` |
| Search — clear | `x` | `Clear search` |
| Pagination — prev / next | `chevron-left` / `chevron-right` | `Previous page` / `Next page` |
| Drag handle | `grip-vertical` | `Drag to reorder {widget title}` |
| Resize handle | `move-diagonal-2` | `Resize {widget title}` |
| Remove widget | `trash` | `Remove {widget title} from dashboard` |
| Mark notification as read | `check` | `Mark as read: {notification title}` |
| Reconnect manually | `refresh-cw` | `Reconnect to live updates` |
| Stage stepper — back | `chevron-left` | `Move {entity} to previous stage: {stage name}` |
| Stage stepper — forward | `chevron-right` | `Advance {entity} to next stage: {stage name}` |
| Bottom nav items | various | item label exposed via `aria-label` since icon+label group is rendered |

### Custom-widget roles

| Component | Element | Role / ARIA |
|---|---|---|
| Tabs (Members / Pending / Removed; All / Mentions / Action; etc.) | container | `role="tablist"`, `aria-orientation="horizontal"` |
| Tabs — each tab | button | `role="tab"`, `aria-selected="true|false"`, `aria-controls="<panel-id>"`, `tabindex` per WAI-ARIA pattern (active=0, others=-1) |
| Tabs — panel | div | `role="tabpanel"`, `aria-labelledby="<tab-id>"` |
| Filter chips group (when single-select) | container | `role="radiogroup"`, `aria-label="Filter by {axis}"` |
| Filter chips (single-select) | each chip | `role="radio"`, `aria-checked` |
| Filter chips (multi-select) | container | regular `<div>`; each chip is a regular toggle button with `aria-pressed` |
| Stage stepper | container | `role="group"`, `aria-label="Hackathon stage progress"`; stages are `aria-current="step"` for the current one |
| Combobox (autocomplete search) | input | `role="combobox"`, `aria-expanded`, `aria-controls="<listbox-id>"`, `aria-activedescendant` |
| Combobox results | container | `role="listbox"`; options are `role="option"` |
| Sortable column header | th | `aria-sort="ascending|descending|none"` |
| Selectable row checkbox | input | regular `<input type="checkbox">` with `aria-label="Select {entity name}"` |
| Side nav | nav | `<nav aria-label="Primary">` |
| Bottom nav | nav | `<nav aria-label="Primary">` (mobile only) |
| Breadcrumbs | nav | `<nav aria-label="Breadcrumb">`, list `<ol>` with last item `aria-current="page"` |
| Modal | div | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="<title>"`, `aria-describedby="<body>"` |
| Modal close-on-scrim affordance | div | inert, no role |
| Bottom sheet | div | `role="dialog"`, same as modal |
| Toast container | div | `role="region"`, `aria-label="Notifications"` (single landmark for SR landing) |
| Live banner (reconnect, retry-exhausted) | div | `role="status"` (polite) for reconnecting; `role="alert"` (assertive) for retry-exhausted |
| Inline form error | div | `role="alert"` only when error first appears; subsequent updates use `aria-live="polite"` to avoid spam |
| Loading skeleton | div | `aria-busy="true"` on the parent landmark; skeleton itself `aria-hidden="true"` |
| Stat card / KPI | div | `role="img"` with `aria-label="42 active partners, up 8 from last week"` so SR reads the meaning, not pixel pieces |
| Chart canvas | div | `role="img"` with `aria-label` summary; `<table>` data-table fallback hidden visually but available to SR |

### Live-region politeness matrix

Every transient surface declares a politeness level. Wrong choice = either missed announcements or interruption fatigue.

| Surface | `aria-live` | `role` | Notes |
|---|---|---|---|
| Notification toast — informational ("12 new since you reconnected") | `polite` | `region` | Doesn't interrupt SR mid-sentence |
| Notification toast — success confirmation ("Partner archived") | `polite` | `status` | Same reason |
| Notification toast — error ("Couldn't save", "Couldn't mark all read") | `assertive` | `alert` | User MUST hear this immediately |
| Notification toast — undo countdown | `off` | — | The numeric countdown shouldn't be re-read every tick; the toast text plus a static "Undo" link is enough |
| Reconnect banner — reconnecting | `polite` | `status` | Background activity; don't interrupt |
| Reconnect banner — offline | `polite` | `status` | First time only; subsequent attempts use `aria-live="off"` to avoid spam |
| Reconnect banner — retry exhausted | `assertive` | `alert` | User must act |
| Mark-all-read snackbar | `polite` | `status` | Includes "Undo (5s)" — the countdown is visual only, NOT in the live region |
| Inline form error (initial appearance) | `assertive` | `alert` | First-time announcement |
| Inline form error (re-validation) | `polite` | (none) | Subsequent updates use polite to avoid interrupting typing |
| Save indicator ("Saved" / "Saving…") | `polite` | `status` | Background |
| Search results count update | `polite` | `status` | "12 results" announces after debounced typing settles |
| Empty-state copy when filter changes results | `polite` | `status` | |
| Drag-and-drop announcements (widget moved) | `assertive` | `alert` | "Moved {widget} to row 3, column 2 of 4" |
| Background data refresh ticker | `off` | — | Truly silent; user opts in via Settings |

### Alt-text intent

| Asset class | `alt` strategy | Examples |
|---|---|---|
| App logo (chrome) | `alt="The Upper Room"` | Top bar logo |
| Decorative auth-page shapes / mesh gradient | `alt=""` (empty) + `aria-hidden="true"` | Sign-in background ornaments |
| Avatar with name visible nearby | `alt=""` (empty); SR reads adjacent name text | List rows, member tiles |
| Avatar standalone (top-bar profile) | name in container `aria-label` (see icon-only table); `alt=""` | |
| Profile-photo placeholder | `alt=""` + decorative; the initials text serves SR | |
| Empty-state illustrations | `alt="No partners yet"` (or matching headline) | Empty inboxes, empty pipelines |
| Chart visualizations | `role="img"` + `aria-label` summary | "Pipeline chart: 12 leads, 8 active, 22 closed this quarter" |
| Partner / hackathon hero image | `alt="{event title}, {date}"` | Hackathon detail header |
| Status badge icons | each badge text already exposes meaning; the icon is `aria-hidden="true"` | All badges in T58 |
| Notification type icons | `aria-hidden="true"`; meaning is in the notification copy | All rows in T55/T56 |

### Form-field label and description binding

Every input pairs three IDs explicitly:

| Slot | Element | Wired via |
|---|---|---|
| Visible label | `<label for="email">` | `for` ↔ `id` |
| Helper / hint text | `<span id="email-hint">` | `aria-describedby="email-hint"` on input |
| Inline error | `<span id="email-error">` | `aria-describedby="email-error email-hint"` on input when error present; `aria-invalid="true"` |

Required fields:
- Mark with visible `*` after the label.
- Add `aria-required="true"` (do NOT use `required` attribute alone — gives inconsistent SR behavior across user agents).
- Required-field legend ("* indicates a required field") at top of every form.

Placeholder text is NEVER used as the label. Floating-label and bottom-label patterns both keep the visible label persistently rendered.

### Frame in `ui-design.pen`

`Desktop / A11y - SR Annotations` shows a representative chrome layout (top bar + side nav + a list row + a toast + an inline-error input) with annotation callouts pointing at each element, listing the role, accessible name, and live-region politeness inline.

## Acceptance criteria

- [x] Annotations applied to every icon-only button and custom widget in the design system.
- [x] Live-region politeness chosen and documented for each transient surface.
- [x] Alt-text intent documented for each image/illustration in the design.
