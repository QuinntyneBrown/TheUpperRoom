# T62 — Map design components to Angular Material wrappers

**Status**: Complete
**Phase**: 10 — Component mapping and acceptance traceability
**Area**: Architecture, Design system
**Requirements**: L1-016, L2-060
**Source**: Recommended Remediation Order — "Map design components to the Angular component library"

## Goal

Produce a mapping document from each Pencil design component to its Angular Material wrapper in the `components` library, with required states and import discipline rules.

## Scope

- Inventory of design components: buttons (primary/secondary/outline/ghost/danger/icon/FAB), inputs (default/focused/error/disabled/search/textarea), card, badge, avatar, alert, toast, side-nav item, bottom-nav item, list item, dialog, snackbar.
- For each: target Angular Material primitive(s), wrapper component name, required states, ARIA pattern.
- Dialog/snackbar usage rules.
- Import-discipline rule: feature modules import from `components`, never directly from Material.

## Component mapping

The Angular workspace exposes a single `components` library (`frontend/projects/components`) that every feature library imports from. `components` wraps Angular Material so that the rest of the app never references `@angular/material/*` directly. This insulates feature code from Material API churn and lets us swap the implementation primitive without ripping through every feature.

### Design system inventory → wrapper map

| Pencil component (id) | Wrapper (selector) | Material primitive | Required input states | A11y pattern (T60/T61) | Notes |
|---|---|---|---|---|---|
| Button/Primary (`CJdjz`) | `<ur-button variant="primary">` | `MatButton` (mat-flat-button) | default · hover · active · focus-visible · disabled · loading · pressed | `<button type=...>` per context; `aria-busy` while loading; loading replaces label, NOT just spinner | Loading state hides label and disables clicks; min 44×44 tap target |
| Button/Secondary (`j1vsZ`) | `<ur-button variant="secondary">` | `MatButton` (mat-stroked-button with elevated bg) | same as primary | same | |
| Button/Outline (`Zwh9N`) | `<ur-button variant="outline">` | `MatButton` (mat-stroked-button) | same as primary | same | |
| Button/Ghost (`m73wip`) | `<ur-button variant="ghost">` | `MatButton` (mat-button) | same as primary | same | |
| Button/Danger (`jn0Od`) | `<ur-button variant="danger">` | `MatButton` (mat-flat-button, palette=warn) | same as primary | confirm dialogs ALWAYS precede destructive activation; `aria-describedby` to confirmation id when used in toolbar | |
| Button/Icon (`zDzYD`) | `<ur-icon-button>` | `MatIconButton` | default · hover · active · focus-visible · disabled · pressed (toggle) | `aria-label` REQUIRED (T61 table); `aria-pressed` for toggles | |
| Button/FAB (`l0oVl4`) | `<ur-fab>` | `MatFabButton` (mat-fab) | default · hover · focus-visible · disabled | `aria-label` REQUIRED; positioned via FAB host directive (avoids overlap with bottom-nav) | Mobile only by default |
| Input (`kTdXr`) | `<ur-input>` | `MatFormField` + `MatInput` (appearance="outline") | default · focused · filled · disabled · readonly | `<label>` always present (no placeholder-as-label); `aria-required`, `aria-invalid`, `aria-describedby` | Floating-label disabled — labels are persistent above the field |
| Input/Focused (`naE2u`) | (state of `<ur-input>`) | — | — | focus-visible ring per T59 | |
| Input/Error (`D0SBZ8`) | (state of `<ur-input>`) | `MatError` | invalid + dirty/touched | `role="alert"` on first error, `aria-live="polite"` after | |
| Input/Disabled (`Y5QHiy`) | (state of `<ur-input>`) | `disabled` attr | — | tooltip explaining why disabled (T53) | |
| Search (`sPvTo`) | `<ur-search>` | `MatFormField` + `MatInput` + leading icon | default · focused · loading · with-results · empty · clearable | `role="combobox"` when paired with autocomplete; `aria-controls` to listbox | Debounce 250ms before announcing result count |
| Textarea (`NUFyM`) | `<ur-textarea>` | `MatFormField` + `MatInput` (textarea) | default · focused · filled · disabled · char-counter | same as input + `aria-describedby` for counter | Auto-grow up to max-height; vertical resize via grip |
| Card (`B42IN`) | `<ur-card>` | `MatCard` | default · hover (when actionable) · focus-visible (when actionable) | `role="button"` only when actionable; otherwise plain article | Cards never trigger navigation if non-actionable |
| Badge/Default (`wsRro`) | `<ur-badge variant="default">` | `MatChip` (display only) | static | `aria-label` if standalone; `aria-hidden` if next to text it duplicates | Non-actionable; for counts use `<ur-badge-count>` instead |
| Badge/Success (`gRxj0`) | `<ur-badge variant="success">` | `MatChip` | static | glyph required (check-check) for grayscale safety | |
| Badge/Warning (`vP7Pn`) | `<ur-badge variant="warning">` | `MatChip` | static | glyph required (triangle-alert) | |
| Badge/Danger (`s4PG7M`) | `<ur-badge variant="danger">` | `MatChip` | static | glyph required (circle-x) | |
| Badge/Info (`X4IrLm`) | `<ur-badge variant="info">` | `MatChip` | static | glyph required (info) | |
| Badge/Accent (`qMNTM`) | `<ur-badge variant="accent">` | `MatChip` | static | for "Live" / "New" markers; pair with explicit text | |
| Avatar/MD (`o3gcq`) | `<ur-avatar size="md">` | none (custom) | with-image · initials · placeholder · focus-visible (when actionable) | `alt=""` when name nearby; `role="button" aria-label="..."` when actionable | 36×36 |
| Avatar/SM (`v2ftCK`) | `<ur-avatar size="sm">` | none | same | same | 24×24 |
| Alert/Info (`gL8GU`) | `<ur-alert variant="info">` | none (custom on `MatCard`) | dismissible · permanent · with-action | `role="status"` (polite); icon `aria-hidden="true"` | |
| Alert/Success (`NbeQS`) | `<ur-alert variant="success">` | same | same | `role="status"` | |
| Alert/Warning (`JcggS`) | `<ur-alert variant="warning">` | same | same | `role="status"` | |
| Alert/Danger (`Bac6Q`) | `<ur-alert variant="danger">` | same | same | `role="alert"` (assertive) | |
| Toast (`OUnJd`) | `<ur-toast>` (programmatic via `ToastService`) | `MatSnackBar` | info · success · error · with-action · with-undo · countdown | per T61 politeness matrix (info/success=polite, error=assertive); container `role="region" aria-label="Notifications"` | Action button is keyboard-focusable when toast lands; max stack of 3, oldest dismissed |
| SideNavItem (`Sdwds`) | `<ur-side-nav-item>` | `MatListItem` (nav variant) | default · hover · focus-visible · active · disabled · with-badge | inside `<nav aria-label="Primary">`; `aria-current="page"` for active | |
| SideNavItem/Inactive (`d7ACr6`) | (state of side-nav-item) | — | — | — | |
| BottomNavItem (`S0JvO`) | `<ur-bottom-nav-item>` | `MatTabNav` (custom theme) | default · focus-visible · active | `aria-current="page"` for active; full label visible (no icon-only) | Mobile only |
| ListItem (`MuH9W`) | `<ur-list-item>` | `MatListItem` | default · hover · focus-visible · selected · with-meta · disabled | inside `MatList` with `aria-label`; selectable variant uses `aria-selected` | |
| Dialog (frames `Dialog/...`) | `<ur-dialog>` (programmatic via `DialogService`) | `MatDialog` | default · destructive (warn palette) · with-form | `role="dialog" aria-modal="true"`, focus trap per T60 | Service signature: `dialog.open(component, {data, restoreFocus, ariaLabelledBy, ariaDescribedBy})` |
| Snackbar (toast w/ undo) | `<ur-snackbar>` (via `SnackbarService`) | `MatSnackBar` (with action) | info · undo (countdown) · error | `role="status"` for undo (polite — user has 5 sec window); error variant `role="alert"` | |

### Wrappers that don't have a Material primitive

These are built fresh in `components`, not wrapping Material:

| Wrapper | Reason |
|---|---|
| `<ur-stage-stepper>` | Hackathon stage progression — Material has no first-class stepper that supports our compact horizontal pattern |
| `<ur-filter-chip>` | We need both single-select (radio semantics) and multi-select (toggle semantics) variants on the same visual chip |
| `<ur-widget-chrome>` | Dashboard widget shell with drag/resize/remove handles |
| `<ur-stat-card>` | KPI tile; Material `MatCard` is too generic |
| `<ur-empty-state>` | Standardizes illustration + headline + helper + CTA |
| `<ur-skeleton>` | `aria-busy` orchestration with consistent shimmer |
| `<ur-live-badge>` | "LIVE" indicator with `aria-hidden` decorative dot + sr-only status text |
| `<ur-overflow-menu>` | Wraps `MatMenu` but enforces our `aria-label` and keyboard pattern |
| `<ur-pagination>` | Wraps Material's paginator with consistent prev/next labels |

### Dialog usage rules

- Always opened via `DialogService.open(component, config)`. Never instantiate `<mat-dialog-*>` from a feature.
- `restoreFocus: true` is the default; opt out only with explicit reason in code.
- `ariaLabelledBy` MUST point to the dialog title id; `ariaDescribedBy` to the body.
- Destructive dialogs use `palette: 'danger'` config flag; this swaps the primary button to `<ur-button variant="danger">` AND reverses initial focus to Cancel.
- Stacked dialogs: Service auto-applies `inert` to the parent dialog; only the topmost is reachable.
- Sheet variant (mobile): `DialogService.openSheet(...)` opens a bottom sheet using the same component contract; service picks the variant by viewport.

### Snackbar / toast usage rules

- Single instance: `ToastService.show({variant, title, action?, undo?, duration?})`.
- Default duration: 4s for info/success; 8s for warnings; **errors are sticky** until dismissed.
- Stack max 3; oldest auto-dismissed when a 4th arrives.
- `undo` callback opt-in for any reversible action (mark read, archive, delete) — render shows countdown bar (visual only; not in live region per T61).
- Toasts NEVER carry navigational links — only an undo or dismiss action. For multi-step recovery flows, open a banner inline at the action site instead.

### Import discipline

**Rule**: Feature libraries (everything under `frontend/projects/feature-*`) import from `@components/*` only. They MUST NOT import from `@angular/material/*` directly.

Enforcement:
- ESLint rule `no-restricted-imports` set in the workspace `tsconfig.json` excludes `@angular/material/*` from feature libraries.
- The `components` library is the only place `@angular/material` appears in `package.json` `dependencies` of the workspace boundary; feature libraries declare it as a `peerDependency` only if they need a type re-export (rare; usually proxied through `components`).
- A CI check greps feature libs for `from '@angular/material` and fails the build on any match.

**Why**: When the team upgrades Material (e.g. v17 → v18) or swaps to a different primitive, the change surface is contained in `components/`. Without this rule, hundreds of feature files start to depend on Material's API shape.

### Where this lives

This file *is* the mapping document. It sits alongside the design source (`docs/ui-design.pen`) in `docs/tasks/`. Implementation team treats this as the canonical reference; updates land here when components are added or refactored.

## Acceptance criteria

- [x] Mapping table written (markdown, alongside the .pen file).
- [x] Every reusable component in the design has a target wrapper.
- [x] Import discipline rule documented for the implementation team.
