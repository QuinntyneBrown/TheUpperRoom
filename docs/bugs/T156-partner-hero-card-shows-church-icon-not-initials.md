# T156 — Partner hero card shows church icon instead of partner name initials

**Status:** Open

## Description

The design shows a 72×72 rounded square at the top of the partner hero card displaying the partner's name initials (first letter of the first word + first letter of the last word) in `$accent-primary` on an `$accent-soft` background with an `$accent-primary` border.

The current implementation renders a hardcoded church icon on a solid `$accent-primary` background instead.

## Design (ui-design.pen)

Frame: `Desktop / Partner Detail`, hero card node `Q2PEfW` → initials box `GvNqj`

- Initials box (`GvNqj`): 72×72, `border-radius: $radius-lg`, `background: $accent-soft`, `border: 1px solid $accent-primary`, centered
- Initials text (`a9kNcR`): e.g. "FT" (FaithTech Toronto), `color: $accent-primary`, `font-size: $fs-2xl`, `font-weight: 600`
- Appears at the top-left of the hero card

## Current Behaviour

A 56×56 box with solid `$accent-primary` background showing a hardcoded `church` Material Symbol icon.

## Expected Behaviour

72×72 rounded square with `$accent-soft` background, `$accent-primary` border, showing initials derived from the partner name (first letter of first word + first letter of last word).

## Failing Tests

`frontend/e2e/tests/partners/partner-hero-initials.spec.ts`
