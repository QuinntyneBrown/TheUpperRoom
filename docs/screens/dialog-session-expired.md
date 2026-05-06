# Dialog: Session Expired

Shown when the active session expires while a user is in the app, including the read-only banner and draft-preserved variants.

## How to navigate

1. Sign in (see [sign-in](sign-in.md)).
2. Stay in the app until the session token expires (or invalidate the session server-side / delete the auth cookie in DevTools to simulate it).
3. Trigger any authenticated request (e.g. navigate, save a form) — the app surfaces:
   - **Modal** (`A439uT` / `YudNr`) — default expiry prompt asking the user to re-authenticate.
   - **Banner (Read-only)** (`mbZ8n`) — observed on read-only pages where a full modal is too heavy.
   - **Draft Preserved** (`P25hX`) — observed on a page that has unsaved form work; the draft is preserved.

## Designs

Frames in `docs/ui-design.pen`:

| Frame Name | Frame ID | Viewport | State |
| ---------- | -------- | -------- | ----- |
| Dialog / Session Expired | `A439uT` | Desktop 1440×1024 | Modal |
| Desktop / Session Expired - Banner (Read-only) | `mbZ8n` | Desktop | Read-only banner variant |
| Desktop / Session Expired - Draft Preserved | `P25hX` | Desktop | Draft preserved variant |
| Mobile / Session Expired | `YudNr` | Mobile 375×812 | Mobile variant |
