# T124 — Partner detail: two-column layout and card CSS missing

**Status**: Fixed

## Description

The partner detail page (`/partners/:id`) has the correct HTML structure (aside.partner-detail__left + div.partner-detail__right) but is missing all CSS for:
- Two-column body layout (`partner-detail__body` needs `display: flex`)
- Partner hero card (`partner-hero-card`, `partner-hero-card__icon`, `partner-hero-card__name`, `partner-hero-card__meta`)
- Stage card (`partner-stage-card`, `partner-stepper`, `partner-stage-card__actions`)
- Stage history (`partner-history`, `partner-history__timeline`, `partner-history__entry`)

Everything renders as an unstyled single-column vertical list.

## Steps to reproduce

1. Navigate to `/partners/:id`
2. The aside and right column stack vertically with no styling

## References
- Design: `Desktop / Partner Detail` → `g9pKsq` → `pdcontent` — `pdLeft` (340px) + `pdRight` (grow)
- `Desktop / Partner Detail - Stage Stepper` → `MHp4q` — hero card (left 340px) + stageCard (right)
