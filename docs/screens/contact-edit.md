# Contact Edit

Edit form for an existing contact across pristine, dirty, validation, submit and read-only states.

## How to navigate

1. Sign in (see [sign-in](sign-in.md)).
2. Click **Contacts** in the side nav.
3. Click a contact → click **Edit** on the contact detail page → `/contacts/:id/edit`.
4. To reach the variant states:
   - **Pristine** (`QgUEL`) — initial render.
   - **Dirty** (`J3T5d`) — change any field.
   - **Validation Error** (`H1MLk`) — submit with a required field empty or a malformed value.
   - **Submitting** (`DWSk9`) — submit a valid form (transient state).
   - **Saved Toast** (`HSfDv`) — observed after a successful save returns.
   - **Read Only** (`KTMCo`) — open the page as a user without the contact-update role.
   - **Conflict Resolved Toast** (`PXPSe`) — resolve a concurrent-edit conflict via [contact conflict dialog](dialog-contact-conflict-resolution.md).

## Designs

Frames in `docs/ui-design.pen`:

| Frame Name | Frame ID | Viewport | State |
| ---------- | -------- | -------- | ----- |
| Desktop / Contact Edit - Pristine | `QgUEL` | Desktop 1440×1024 | Pristine |
| Desktop / Contact Edit - Dirty | `J3T5d` | Desktop | Dirty (unsaved) |
| Desktop / Contact Edit - Validation Error | `H1MLk` | Desktop | Field validation errors |
| Desktop / Contact Edit - Submitting | `DWSk9` | Desktop | Submit pending |
| Desktop / Contact Edit - Saved Toast | `HSfDv` | Desktop | Save success toast |
| Desktop / Contact Edit - Read Only | `KTMCo` | Desktop | RBAC read-only |
| Desktop / Contact Edit - Conflict Resolved Toast | `PXPSe` | Desktop | After conflict resolution |
