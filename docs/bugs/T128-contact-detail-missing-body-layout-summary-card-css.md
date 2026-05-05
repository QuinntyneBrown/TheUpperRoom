# T128 — Contact detail: body layout, summary card, and meta-row CSS missing

**Status**: Fixed

## Description

The contact detail page (`/contacts/:id`) is missing CSS for the body layout and summary card:
- `.contact-detail__body` — needs `display: flex; gap: 24px; padding: 32px` for two-column layout
- `.contact-detail__summary` — needs card styling (bg-surface, border, border-radius, padding, flex-shrink 0, width 340px)
- `.contact-detail__meta-row` — needs `display: flex; align-items: center; gap: 10px` for icon+text rows

The result: contact meta fields (email, phone, city) and the notes panel stack vertically instead of showing the designed two-column layout.

## Steps to reproduce

1. Navigate to `/contacts/:id`
2. Email/phone/city and notes stack vertically without padding or card styling

## References
- Design: `Desktop / Contact Detail` → `v079V` body — left 380px profile card + right fill notes column
- Profile card: bg-surface, border-subtle, radius-lg, padding $sp-6
