# T159 — Auth pages: sign-in card not vertically centered

**Status**: Fixed

## Description

Auth pages (`/auth/sign-in`, `/auth/register`, etc.) render the `.auth-card` at the top of the viewport with no vertical centering. The design shows the card centered in the viewport.

## Fix

- Added `.auth-page` global CSS class to `styles.scss`: `display: flex; align-items: center; justify-content: center; min-height: 100dvh; padding: 24px 16px`
- Wrapped `.auth-card` in `<div class="auth-page">` in all auth page templates

## References

- Design: auth screens show the card centered vertically on the page
