# 54 — List and Detail Responsive Route Patterns

**Traces to:** L2-039, L2-040. L1-009.

Vertical slice: shared list-card pattern and detail two-column pattern that every feature route consumes verbatim.

## Status
Accepted

## Components

- Frontend `components/list-card-list` — given an items array and a card template, renders cards on `<lg` and a table on `>=lg`.
- Frontend `components/detail-two-column` — projects two slots (`<main>` and `<aside>`); stacks on `<md`, side-by-side `2fr/1fr` on `>=md`.
- Feature pages adopt these wrappers:
  - Contacts list (slice 14), partners list (slice 42), hackathon list (slice 43) → `list-card-list`.
  - Contact detail (slice 09), partner detail (slice 19), hackathon detail (slice 24) → `detail-two-column`.

## Acceptance tests

- L2-039 / L2-040: at `375x667`, contacts and partners lists render as cards; details stack vertically.
- L2-040: at `768x1024`, details switch to two columns; lists remain card-based with denser spacing.
- L2-040: at `>=992`, list pages render as tables.

## Radical simplicity notes

- Two components total. No layout DSL. CSS Grid handles the breakpoints.
- Feature pages do not write their own breakpoint logic.
