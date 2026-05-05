# T177 — Widespread wrong color token fallbacks across 20 files

**Status:** Fixed ✓

## Description

20 files across contacts, partners, team, auth, admin, dashboard, and notifications use Slate/light-mode CSS fallback values for backgrounds, borders, error states, and skeleton loaders.

## Files fixed

- `feature-contacts`: contacts-list-page, contact-create-page, contact-edit-page, contact-detail-page, notes-panel
- `feature-partners`: partner-list-page, partner-detail-page, partner-create-page, partner-edit-page, partner-contacts-panel
- `feature-team`: global-teams-page, global-team-detail-page, invite-dialog, role-chip-editor
- `feature-admin`: deleted-contacts-page, deleted-hackathons-page
- `feature-dashboard`: line-chart-widget
- `feature-notifications`: notification-center
- `feature-auth`: register-page.css
- `app-shell`: app.scss

## Patterns replaced

| Old | Correct |
|---|---|
| `var(--ur-bg-overlay, #1e293b)` | `var(--ur-bg-surface, #16161f)` |
| `var(--ur-bg-surface, #1e293b)` | `var(--ur-bg-surface, #16161f)` |
| `var(--ur-skeleton-bg, #1e293b)` | `var(--ur-border-default, #2a2a3a)` |
| `var(--ur-skeleton-bg, #f1f5f9)` | `var(--ur-border-default, #2a2a3a)` |
| `var(--ur-skeleton, #e2e8f0)` | `var(--ur-border-default, #2a2a3a)` |
| `var(--ur-border-subtle, #334155)` | `var(--ur-border-subtle, #222233)` |
| `var(--ur-border-default, #334155)` | `var(--ur-border-default, #2a2a3a)` |
| `var(--ur-error-bg, #fef2f2)` | `color-mix(in srgb, var(--ur-danger, #f87171) 12%, transparent)` |
| `var(--ur-error-fg, #dc2626)` | `var(--ur-danger, #f87171)` |
| `var(--ur-error-border, #fecaca)` | `color-mix(in srgb, var(--ur-danger, #f87171) 40%, transparent)` |
