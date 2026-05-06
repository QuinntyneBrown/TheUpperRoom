# Dialog: Global Search

Cmd-K style global search overlay across recent / min-length / loading / results / no-results states.

## How to navigate

1. Sign in (see [sign-in](sign-in.md)).
2. From any authenticated page, press **Ctrl/Cmd + K** (or click the search icon in the top app bar) → opens the dialog (`PmZV6` / `b43dj`).
3. To reach the variant states:
   - **Recent** (`GxGPY`) — open the dialog with no query typed and at least one prior search.
   - **Min Length** (`ZnIqi`) — type 1 character.
   - **Loading** (`sRRIl`) — observed while the request for a typed query is pending.
   - **Results** (`W5nN32`) — type a query that matches.
   - **No Results** (`bFXfn`) — type a query that matches nothing.
   - **Contact Note Snippets** (`TeYR7`) — type a query that matches text inside contact notes.

## Designs

Frames in `docs/ui-design.pen`:

| Frame Name | Frame ID | Viewport | State |
| ---------- | -------- | -------- | ----- |
| Dialog / Global Search | `PmZV6` | Desktop 720×700 | Default |
| Tablet / Global Search Dialog | `b43dj` | Tablet 768×1024 | Default |
| Mobile / Global Search - Recent | `GxGPY` | Mobile 375×812 | Recent searches |
| Mobile / Global Search - Min Length | `ZnIqi` | Mobile | Below min query length |
| Mobile / Global Search - Loading | `sRRIl` | Mobile | Loading |
| Mobile / Global Search - Results | `W5nN32` | Mobile | Results |
| Mobile / Global Search - No Results | `bFXfn` | Mobile | No matches |
| Desktop / Global Search - Contact Note Snippets | `TeYR7` | Desktop | Result snippets from contact notes |
