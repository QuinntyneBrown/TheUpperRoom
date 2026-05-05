# T155 — Contact detail profile card missing avatar/initials circle

**Status:** Fixed ✓

## Description

The design shows a 96×96 circular avatar at the top of the contact profile card (left column) displaying the contact's initials (first letter of first name + first letter of last name) in `$accent-primary` color on an `$accent-soft` background.

The current implementation renders only the name heading and meta rows — no avatar.

## Design (ui-design.pen)

Frame: `Desktop / Contact Detail`, profile card node `c05sA4`

- Avatar element (`FdBiU`): 96×96, `border-radius: $radius-full`, `background: $accent-soft`, `border: 1px solid $accent-primary`, centered
- Initials text (`tNpfr`): e.g. "SM", `color: $accent-primary`, `font-size: $fs-2xl`, `font-weight: 600`
- Appears at the top of the profile card, above the name

## Current Behaviour

No avatar circle rendered in the profile card.

## Expected Behaviour

96×96 circular avatar with initials derived from `firstName[0] + lastName[0]` displayed at top of profile card.

## Failing Tests

`frontend/e2e/tests/contacts/contact-detail-avatar.spec.ts`
