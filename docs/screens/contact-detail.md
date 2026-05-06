# Contact Detail

Read view for a single contact, including notes section states and permission variants.

## How to navigate

1. Sign in (see [sign-in](sign-in.md)).
2. Click **Contacts** in the side nav.
3. Click any contact row → `/contacts/:id` (`FBydC` / `vGxjB` / `TowbR`).
4. To reach the variant states:
   - **Edit Note** (`sp2KI`) — on a note, click **Edit**.
   - **Notes Permission Hidden** (`XAibf`) — sign in as a user without the notes-read role.
   - **Note Over Limit** (`b5r9L`) — start adding a note and type past the character limit.
   - **Note Server Error** (`XULTc`) — submit a note while the API errors.
   - **Delete Permission Denied** (`FQveG`) — sign in as a user without the contact-delete role and view the page.

## Designs

Frames in `docs/ui-design.pen`:

| Frame Name | Frame ID | Viewport | State |
| ---------- | -------- | -------- | ----- |
| Desktop / Contact Detail | `FBydC` | Desktop 1440×1024 | Default |
| Mobile / Contact Detail | `vGxjB` | Mobile 375×812 | Default |
| Tablet / Contact Detail | `TowbR` | Tablet 768×1024 | Default |
| Desktop / Contact Detail - Edit Note | `sp2KI` | Desktop | Inline note edit |
| Desktop / Contact Detail - Notes Permission Hidden | `XAibf` | Desktop | Notes hidden by RBAC |
| Desktop / Contact Detail - Note Over Limit | `b5r9L` | Desktop | Note exceeds char limit |
| Desktop / Contact Detail - Note Server Error | `XULTc` | Desktop | Note save server error |
| Desktop / Contact Detail - Delete Permission Denied | `FQveG` | Desktop | Delete blocked by RBAC |
