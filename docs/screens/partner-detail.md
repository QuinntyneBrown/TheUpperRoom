# Partner Detail

Read view for a single partner including the funnel/stage stepper, stage history, and contact-association toasts.

## How to navigate

1. Sign in (see [sign-in](sign-in.md)).
2. Click **Partners** in the side nav.
3. Click any partner row → `/partners/:id` (`g9pKsq` / `GuE6t`).
4. To reach the variant states:
   - **Stage Stepper** (`MHp4q`) — default render of the funnel stepper widget.
   - **Stage Submitting** (`fLwJv`) — click a stage in the stepper and confirm; transient state while saving.
   - **Stage Success Toast** (`Qv3Be`) — observed when the stage change save returns successfully.
   - **Stage History** (`wvjZP` / `gnOQ6`) — open the **History** tab/section on the page.
   - **Stage History Empty** (`CTgXg`) — open the History tab on a partner with no stage changes.
   - **Contact Associated Toast** (`z1syz`) — associate an existing contact via [associate contact dialog](dialog-associate-contact.md).
   - **Created and Linked Toast** (`fUbIB`) — create a new contact via [new contact from partner dialog](dialog-new-contact-from-partner.md).
   - **Delete Permission Denied** (`WzDdv`) — open as a user without the partner-delete role.

## Designs

Frames in `docs/ui-design.pen`:

| Frame Name | Frame ID | Viewport | State |
| ---------- | -------- | -------- | ----- |
| Desktop / Partner Detail | `g9pKsq` | Desktop 1440×1024 | Default |
| Mobile / Partner Detail | `GuE6t` | Mobile 375×812 | Default |
| Desktop / Partner Detail - Stage Stepper | `MHp4q` | Desktop | Funnel stepper |
| Desktop / Partner Detail - Stage Submitting | `fLwJv` | Desktop | Stage change pending |
| Desktop / Partner Detail - Stage Success Toast | `Qv3Be` | Desktop | Stage change toast |
| Desktop / Partner Detail - Stage History | `wvjZP` | Desktop | History populated |
| Desktop / Partner Detail - Stage History Empty | `CTgXg` | Desktop | History empty |
| Mobile / Partner Detail - Stage History | `gnOQ6` | Mobile | History |
| Desktop / Partner Detail - Contact Associated Toast | `z1syz` | Desktop | Toast after associate |
| Desktop / Partner Detail - Created and Linked Toast | `fUbIB` | Desktop | Toast after new contact + link |
| Desktop / Partner Detail - Delete Permission Denied | `WzDdv` | Desktop | Delete blocked by RBAC |
