# T60 — Keyboard navigation and modal focus trap

**Status**: Complete
**Phase**: 9 — Accessibility annotations
**Area**: Accessibility
**Requirements**: L1-015, L2-057
**Source**: Screen-Level Missing Inventory — "Accessibility ... modal focus-trap ... annotations"

## Goal

Annotate keyboard navigation flow and focus-trap behavior for every dialog and overlay, plus tab order on each primary screen.

## Scope

- Tab-order arrows or numbered annotations on each primary screen (sign-in, dashboard, contacts, partners, hackathons, team, notifications, settings).
- Modal focus-trap notes: first focused element on open, return focus on close, Esc-to-close behavior.
- Skip-to-content link in navigation.
- Keyboard equivalents for chart and dashboard editor gestures (links to T11, T14).

## Design notes

### Per-screen tab order

Tab-order numbering follows visual reading order top-down, left-to-right within each landmark, then moves to the next landmark. Skip links are always 1–2.

#### Sign-in (`Desktop / Sign In`)
1. Skip to main content
2. Email input
3. Password input
4. Show/hide password toggle
5. Forgot password link
6. Sign in button
7. SSO buttons (left to right)
8. Create account link

#### Dashboard (`Desktop / Dashboard - Empty First Widget`, `... - Drag Resize`)
1. Skip to main content
2. Skip to widget grid
3. Side-nav items (top to bottom)
4. Top-bar search
5. Top-bar live indicator (decorative, not focusable)
6. Notification bell
7. Profile menu
8. **Edit dashboard** toggle (enters editor mode)
9. Per widget (in DOM order):
   - Widget chrome → drag handle → resize handle → remove button
   - Widget body content focusables (charts use the chart-keyboard mode, T11)

#### Contacts list (`Desktop / Contacts`)
1. Skip to main content
2. Side-nav
3. Top-bar
4. Filter chips (left to right)
5. Search input
6. New contact button
7. Each row (Enter opens, M = mark read)
8. Pagination

#### Partners (`Desktop / Partners`, `Desktop / Partner Detail`)
1. Skip to main content
2. Side-nav
3. Top-bar
4. Stage filter (T42)
5. Search
6. New partner
7. Each card (Enter opens detail)

#### Hackathons (`Desktop / Hackathons`, `Desktop / Hackathon Detail`)
1. Skip to main content
2. Side-nav
3. Top-bar
4. Filter chips
5. New hackathon
6. Each row
7. Stage stepper (Left/Right arrows move between stages, Enter advances)

#### Team (`Desktop / Team`)
1. Skip to main content
2. Side-nav
3. Top-bar
4. Tabs (Members | Pending | Removed)
5. Invite button
6. Member rows

#### Notifications (`Desktop / Notification Center`)
1. Skip to main content
2. Side-nav
3. Top-bar
4. Mark all as read
5. Group toggle (While you were away)
6. Each notification row (Enter navigates, M marks read, Shift+M un-reads)

#### Settings (`Desktop / Settings`)
1. Skip to main content
2. Side-nav
3. Top-bar
4. Settings sub-nav
5. Form fields (in DOM order)
6. Save / Cancel

### Modal focus-trap rules

Every dialog/sheet/modal in the design system:

| Concern | Rule |
|---|---|
| **Initial focus** | Lands on the dialog title's wrapping element if non-interactive (so screen reader announces the title), then auto-advances to the **first non-destructive interactive element** on the next Tab. If the first focusable is destructive (Delete), focus lands on Cancel instead. |
| **Tab cycling** | Tab cycles forward through dialog focusables; Shift+Tab cycles back. Tab from last → first. Shift+Tab from first → last. Background page Tab stops are NOT reachable. |
| **Esc** | Closes the dialog (equivalent to Cancel). Destructive confirms (e.g. Delete) ALSO close on Esc — destructive intent must be explicit click/Enter on the destructive button. |
| **Click on scrim** | Same as Esc, EXCEPT for forms with unsaved changes — those show the "Discard changes?" sub-dialog (T06). |
| **Return focus** | When the dialog closes, focus returns to the element that opened it. If that element was removed (e.g. delete confirm removed the row), focus goes to the next sibling, or the parent landmark heading if no sibling. |
| **Stacked dialogs** | Inner dialog gets the trap; outer dialog is inert (`inert` attribute) but visible. Esc closes innermost first. |
| **Auto-focus + IME** | Auto-focus is suppressed if a screen-reader virtual cursor is detected mid-navigation, to avoid hijacking the user's place. |

### Annotated dialog inventory

Every dialog frame in the design has a numbered tab-order annotation overlay AND a focus-trap callout. Inventory:

| Dialog frame | First focus | Return focus to |
|---|---|---|
| `Dialog / Hackathon Stage - Advance` | Confirm | Stage stepper at advanced position |
| `Dialog / Confirm Mark All Read` | Cancel (destructive primary) | Mark-all-read toolbar button |
| `Dialog / Contact Audit Restore` | Restore | Audit row that was acted on |
| `Dialog / Delete Hackathon` | Cancel | Hackathon overflow menu |
| `Dialog / Restore Hackathon` | Restore | Trash row |
| `Dialog / Dashboard - Add Widget` (T47) | Search input | Add-widget button in toolbar |
| `Dialog / Discard Changes?` | Keep editing | The Cancel button that triggered it |
| Sheet `Mobile / Confirm Mark All Read` | Cancel | Mark-all-read toolbar button |
| Modal `Drag Resize - Reset Layout` | Cancel | Reset button |

### Skip-link in side-nav component

The side-nav `Component/SideNav` (root) gains two visually-hidden links above the first nav item, surfaced on `:focus-visible`:

1. **Skip to main content** → focuses the `<main>` landmark.
2. **Skip to navigation** → focuses the first side-nav item (used after the user is in `<main>`, to jump back to chrome).

Both render as `Button/Primary` styling when focused; both are positioned absolutely at the top of the side-nav (so they paint above the rail) and use `$focus-ring`.

### Chart and dashboard editor keyboard equivalents

Per T11 (dashboard editor) and T14 (chart touch interactions):

| Gesture | Pointer | Keyboard |
|---|---|---|
| Drag widget | Click handle, drag | Focus handle → Space to "lift" → Arrow keys to move (8px steps; Shift+Arrow = 32px) → Space to drop, Esc to cancel |
| Resize widget | Drag corner handle | Focus resize handle → Space to "grab" → Arrow keys to resize (1 grid unit per press) → Space to commit, Esc to cancel |
| Remove widget | Click trash | Focus remove → Enter (opens confirm) |
| Reset layout | Click Reset | Focus Reset button → Enter |
| Chart series highlight | Hover bar | Focus chart → Tab through series; current series gets 2px white outline + tooltip near focused series |
| Chart bar drill-down | Click bar | Focus chart → Arrow keys move within bars → Enter drills |
| Chart legend toggle | Click swatch | Focus legend item → Space toggles series visibility |

All chart focusable elements receive the standard `$focus-ring` treatment (T59).

### Frame in `ui-design.pen`

`Desktop / A11y - Tab Order Annotations` shows the dashboard with numbered overlays for every focusable in tab order, plus a callout legend. Adjacent frames show the focus-trap diagram for a representative dialog (`Dialog / Hackathon Stage - Advance`).

## Acceptance criteria

- [x] Tab-order annotations exist on the listed primary screens.
- [x] Focus-trap and return-focus annotations exist on every dialog frame.
- [x] Skip link is documented in the side-nav component.
