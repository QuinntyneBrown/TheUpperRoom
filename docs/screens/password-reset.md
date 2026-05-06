# Password Reset

Set new password from a recovery token link.

## How to navigate

No login required — reached from the link in the password recovery email.

1. Trigger a recovery email (see [password-recovery](password-recovery.md)).
2. Open the link in the email → `/password-reset?token=...`.
3. The state shown depends on the token / submit:
   - **Default** (`ItGzU` / `AcmRG`) — token valid, prompt for new password.
   - **Expired** (`uLZUz` / `H0eWPD`) — token past TTL.
   - **Already Used** (`YOxzq`) — token already consumed.
   - **Success** (`g7ucu8`) — submit a valid new password.

## Designs

Frames in `docs/ui-design.pen`:

| Frame Name | Frame ID | Viewport | State |
| ---------- | -------- | -------- | ----- |
| Desktop / Password Reset | `ItGzU` | Desktop 1440×1024 | Default |
| Desktop / Password Reset - Expired | `uLZUz` | Desktop | Token expired |
| Desktop / Password Reset - Already Used | `YOxzq` | Desktop | Token already consumed |
| Desktop / Password Reset - Success | `g7ucu8` | Desktop | New password set |
| Mobile / Password Reset | `AcmRG` | Mobile 375×812 | Default |
| Mobile / Password Reset - Expired | `H0eWPD` | Mobile | Token expired |
