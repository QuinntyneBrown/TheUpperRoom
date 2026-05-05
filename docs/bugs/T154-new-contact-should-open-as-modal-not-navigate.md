# T154 — "New contact" opens routed page instead of modal dialog

**Status:** Open

## Description

The design shows the "New contact" action as a modal dialog overlaid on the contacts list (user stays at `/contacts`). The current implementation navigates to `/contacts/new` as a separate route, losing the contacts list context.

## Design (ui-design.pen)

Frame: `Dialog / New Contact - Empty (Submit Disabled)`

- Modal dialog (640px) centered over full-page scrim
- Header: "New contact" title + X close button
- Form fields:
  - row1: First name * + Last name * (side by side)
  - Email * (full width, required)
  - row2: Phone + City (side by side)
  - Partner (optional) (full width)
  - Hint: info icon + "Fill required fields (*) to enable Save"
- Footer: Cancel button + "Save contact" (disabled until First name, Last name, Email filled)

## Current Behaviour

Clicking `+ New contact` navigates to `/contacts/new` — a separate full page.

## Expected Behaviour

Clicking `+ New contact` stays on `/contacts` and opens a modal dialog.

## Failing Tests

`frontend/e2e/tests/contacts/new-contact-dialog.spec.ts`
