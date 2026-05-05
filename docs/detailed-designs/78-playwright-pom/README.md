# 78 — Playwright Page Object Foundation

**Traces to:** L2-063. L1-009.

## Status
Complete

Vertical slice: directory layout, base fixtures, mailbox fixture, selector rules. No flow tests in this slice — each E2E flow slice depends on this.

## Components

- Test directory `frontend/e2e/`:
  ```
  e2e/
    fixtures.ts       # base test extensions
    mailbox.ts        # MailHog/Mailpit client
    pages/
      auth-pages.ts
      dashboard-page.ts
      contacts-page.ts
      partners-page.ts
      hackathons-page.ts
      team-page.ts
      notifications-panel.ts
      global-search-overlay.ts
    tests/            # flow specs go here, one file per slice 79-86
  ```
- `fixtures.ts` exposes `test` extended with `auth`, `mailbox`, `dashboard`, `contacts`, etc., each producing the corresponding page object.
- Selector convention: page objects use only `data-testid` selectors (and roles/labels for accessibility-first interactions). Tests do not call `page.locator(...)`.
- Lint rule rejects `page.locator(` and `page.getByText(` outside `pages/`.

## Acceptance tests

- A canary test imports `auth.signIn()` and `contacts.openCreateForm()` from page objects and runs to green.
- Lint flags any `page.locator(` use in a test file.

## Radical simplicity notes

- One page object per top-level domain. No deep inheritance.
- Mailbox uses a real local SMTP capture (Mailpit) so verification flows are E2E rather than mocked.
