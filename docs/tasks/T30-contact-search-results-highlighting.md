# T30 — Contact-specific search results with highlighting

**Status**: Accepted
**Phase**: 4 — Contact lifecycle
**Area**: Contacts, Search
**Requirements**: L1-011, L2-014, L2-043
**Source**: Screen-Level Missing Inventory — "Contact-specific search results with snippets/highlighting"

## Goal

Within both the contacts list and the global search dialog, contact results should show match snippets with highlighted query terms.

## Scope

- Contact result row design: name with highlighted match, role/partner subline, email/phone snippet with highlight if matched.
- Note-content match: 1-line snippet with highlighted term and a "from <author>, <date>" subline.
- Highlight token: bold + underline OR accent background; choose one and apply consistently.

## Design notes

- **Highlight token style** — chosen `$accent-soft` background pill + `$accent-primary` `fontWeight: 700` text. Pill has 4 px (`$sp-1`) horizontal padding and `$radius-sm` corners. Carries a subtle `$accent-primary` 1 px border in the global search dialog because the row itself is selected (accent-soft fill); border ensures the highlight remains distinguishable against the row background. Contrast on dark theme: `$accent-primary` (#9F86FF) on `$accent-soft` (#1A1432) ≈ 6.2:1, AA-large for UI text and AA for body sizes ≥ 14 px.
- **Result row anatomy** — avatar | body (name with highlights, sub-line with role/partner, optional snippet) | trailing `match badge` chip ("name + email", "note") that summarises which fields matched.
- **Note snippet** — appears as an indented sub-card with a left accent stripe and a 12 px `file-text` icon. Snippet is a single line `"...<context> <highlight> <context>..."` truncated with `…` ellipsis at both ends. A footer line lists the author and date plus `+N more matches in notes` when the contact has additional matches that didn't fit.
- **Multi-match behavior** — at most one snippet per result row; additional matches are summarised in the `+N more` footer and revealed when the user opens the contact detail (which highlights all in-page hits via the same pill style).
- **Accessibility** — highlighted spans should be wrapped in `<mark>` semantics in the implementation so screen readers announce them as emphasised text.

## Acceptance criteria

- [ ] Contact result variant designed for both contacts list search and global search.
- [ ] Highlight style meets AA contrast on the dark theme.
- [ ] Multi-match snippet behavior documented (truncation, ellipsis).
