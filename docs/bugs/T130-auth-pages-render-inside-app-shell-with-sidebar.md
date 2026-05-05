# T130 — Auth pages render inside app shell with sidebar; auth-card has no CSS

**Status**: Fixed

## Description

Two related issues:

1. **Sidebar visible on auth pages**: When navigating to `/auth/sign-in`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password`, `/auth/verify`, the Material sidenav stays open. The design shows auth pages as standalone centered pages with NO sidebar.

2. **`.auth-card` has no CSS**: All auth pages use `<div class="auth-card">` but no CSS for this class exists anywhere. The card should be 480px wide, centered, with bg-surface background, border, radius-2xl, and padding.

## Design reference
- `Desktop / Sign In` (`BNkiY`): full-width bg-base with centered `signinCard` (480px, bg-surface, border-subtle, radius-2xl, padding $sp-12) — no sidebar frame visible.

## Fix
- In `app.ts`: make `sidenavOpened` route-aware — hide on `/auth/**` paths
- Add `.auth-card` CSS (centered, 480px, card styling) globally or to each auth page

## References
- Design: `Desktop / Sign In` → `Yelo6` → `R7sFzi`
