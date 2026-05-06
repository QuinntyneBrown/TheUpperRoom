# Dashboard

Customizable widget grid (charts, summaries, real-time tiles), with edit, drag, resize, save and recovery flows. The chart card frames define the live/updating/stale/offline states each chart widget must render.

## How to navigate

1. Sign in (see [sign-in](sign-in.md)) — successful sign-in lands on `/dashboard`.
2. To reach the variant states from the default view:
   - **Empty** (`FLbwf` / `YzIJd` / `z75lC`) — sign in as a user with no saved widgets (first run).
   - **Edit Mode** (`wZqVm` / `PFNd0` / `lBSD7`) — click **Edit dashboard** in the page header.
   - **Drag In Progress** (`LdWWd`) — in edit mode, press-and-drag a widget.
   - **Resize In Progress** (`iUfVj`) — in edit mode, drag a widget's resize handle.
   - **Remove + Undo Snackbar** (`siI2D`) — in edit mode, click the remove icon on a widget.
   - **Layout Saved Toast** (`oRqQp`) — exit edit mode after a successful save.
   - **Layout Restored Notice** (`Q3a5q`) — load the dashboard after the server reconciled a remote edit (LWW restore).
   - **Save Failed Toast** (`y5HRdJ`) — exit edit mode while the save request fails.
   - **Chart card states** (`bUm6q`/`aJ4Qi`/`Ja0tJ`/`T06Ziy`) — observed on a chart widget as the SignalR stream goes live → updating → stale → offline.
   - **Mobile chart interactions** (`Z5hmjW`/`cV3L6`/`F4BDi4`/`xafDA`/`nZbya`) — on mobile or tablet, tap, long-press scrub, toggle a legend item, or page through dense series on a chart.

## Designs

Frames in `docs/ui-design.pen`:

### Page

| Frame Name | Frame ID | Viewport | State |
| ---------- | -------- | -------- | ----- |
| Mobile / Dashboard | `U7g24` | Mobile 375×812 | Default |
| Tablet / Dashboard | `d5yJiU` | Tablet 768×1024 | Default |
| Desktop / Dashboard - Empty | `FLbwf` | Desktop 1440×1024 | First-run empty state |
| Mobile / Dashboard - Empty | `YzIJd` | Mobile | Empty |
| Tablet / Dashboard - Empty | `z75lC` | Tablet | Empty |
| Desktop / Dashboard - Edit Mode | `wZqVm` | Desktop | Edit mode |
| Mobile / Dashboard - Edit Mode | `PFNd0` | Mobile | Edit mode |
| Tablet / Dashboard - Edit Mode | `lBSD7` | Tablet | Edit mode |
| Desktop / Dashboard - Drag In Progress | `LdWWd` | Desktop | Widget drag |
| Desktop / Dashboard - Resize In Progress | `iUfVj` | Desktop | Widget resize |
| Desktop / Dashboard - Remove + Undo Snackbar | `siI2D` | Desktop | After remove, undo offered |
| Desktop / Dashboard - Layout Saved Toast | `oRqQp` | Desktop | Save success toast |
| Desktop / Dashboard - Layout Restored Notice | `Q3a5q` | Desktop | LWW restore notice |
| Desktop / Dashboard - Save Failed Toast | `y5HRdJ` | Desktop | Save failure toast |

### Chart card states

| Frame Name | Frame ID | State |
| ---------- | -------- | ----- |
| Component / Chart Card - Live | `bUm6q` | Live data streaming |
| Component / Chart Card - Updating | `aJ4Qi` | Update pulse |
| Component / Chart Card - Stale | `Ja0tJ` | Data stale |
| Component / Chart Card - Offline | `T06Ziy` | Disconnected |

### Mobile / tablet chart interactions

| Frame Name | Frame ID | Viewport | State |
| ---------- | -------- | -------- | ----- |
| Mobile / Chart - Tap Tooltip | `Z5hmjW` | Mobile | Tap tooltip |
| Mobile / Chart - Long-press Scrub | `cV3L6` | Mobile | Scrub |
| Mobile / Chart - Legend Toggle | `F4BDi4` | Mobile | Series toggle |
| Mobile / Chart - Paginated Dense Series | `xafDA` | Mobile | Pagination |
| Tablet / Chart - Tap Tooltip | `nZbya` | Tablet | Tap tooltip |
