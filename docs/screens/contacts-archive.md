# Contacts Archive

Soft-deleted contacts list, with restore action.

## How to navigate

1. Sign in (see [sign-in](sign-in.md)).
2. Click **Contacts** in the side nav.
3. Switch to the **Archive** tab (or open `/contacts/archive`).
4. To reach the variants:
   - **Default** (`naCRb` / `NLHys`) — at least one archived contact exists.
   - **Empty** (`IVOHW`) — no archived contacts exist for the user.

## Designs

Frames in `docs/ui-design.pen`:

| Frame Name | Frame ID | Viewport | State |
| ---------- | -------- | -------- | ----- |
| Desktop / Contacts - Archive | `naCRb` | Desktop 1440×1024 | Default archive |
| Desktop / Contacts - Archive Empty | `IVOHW` | Desktop | Empty archive |
| Mobile / Contacts - Archive | `NLHys` | Mobile 375×812 | Archive |
