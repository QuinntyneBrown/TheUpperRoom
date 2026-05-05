# T142 — Hackathon detail page missing layout and typography CSS

**Status**: Fixed ✓

## Description

`HackathonDetailPageComponent` styles only define toast, loading skeleton, and 4D card classes. All structural layout classes used in the template have no CSS rules:

- `.hackathon-detail` — wrapper, no padding
- `.hackathon-detail__header` — should be flex row (title left, actions right); no layout
- `.hackathon-detail__header-actions` — action buttons not flex row with gap; stack under title
- `.hackathon-detail__back` — back link no color/flex styling
- `.hackathon-detail__back-icon` — icon size
- `.hackathon-detail__title` — heading no font-size/weight override
- `.hackathon-detail__meta` — subtitle no color/font styling
- `.hackathon-detail__body` — no padding or gap between sections
- `.hackathon-detail__section-title` — section headers have no font styling
- `.hackathon-partners` — unordered list has no list-style reset
- `.hackathon-partners__item` — list items have no layout
- `.hackathon-history` — history list has no list-style reset
- `.hackathon-history__item` — should be flex row; arrow, from, to, time unstyle

## Fix

Add missing CSS classes to `HackathonDetailPageComponent` styles array.

## References

- Route: `/hackathons/:id`
- Component: `frontend/projects/feature-hackathons/src/lib/hackathon-detail-page/hackathon-detail-page.ts`
