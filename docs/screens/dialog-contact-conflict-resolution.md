# Dialog: Contact Conflict Resolution

Resolve a concurrent-edit conflict on a contact (local vs. server changes).

## How to navigate

1. Sign in (see [sign-in](sign-in.md)).
2. Open a contact for editing (see [contact-edit](contact-edit.md)).
3. While the form is dirty, have another session save a change to the same contact.
4. Click **Save** — the conflict dialog opens:
   - **Modal** (`sLo2c`) on desktop / tablet.
   - **Sheet** (`frmEU`) on mobile.

## Designs

Frames in `docs/ui-design.pen`:

| Frame Name | Frame ID | Viewport | State |
| ---------- | -------- | -------- | ----- |
| Dialog / Contact Conflict Resolution | `sLo2c` | Desktop 1440×1024 | Modal |
| Mobile / Contact Conflict Sheet | `frmEU` | Mobile 375×812 | Bottom sheet |
