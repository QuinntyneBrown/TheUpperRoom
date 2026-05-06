# Partner Edit

Edit form for an existing partner across pristine, dirty, validation, submit and read-only states.

## How to navigate

1. Sign in (see [sign-in](sign-in.md)).
2. Click **Partners** in the side nav.
3. Click a partner → click **Edit** on the partner detail page → `/partners/:id/edit`.
4. To reach the variant states:
   - **Pristine** (`jS1hx`) — initial render.
   - **Dirty** (`ENGdt`) — change any field.
   - **Validation Error** (`I8eU2`) — submit with required fields empty or malformed.
   - **Submitting** (`u5yba`) — submit a valid form (transient).
   - **Saved Toast** (`AmYek`) — observed after a successful save.
   - **Read Only** (`KgJyC`) — open as a user without the partner-update role.

## Designs

Frames in `docs/ui-design.pen`:

| Frame Name | Frame ID | Viewport | State |
| ---------- | -------- | -------- | ----- |
| Desktop / Partner Edit - Pristine | `jS1hx` | Desktop 1440×1024 | Pristine |
| Desktop / Partner Edit - Dirty | `ENGdt` | Desktop | Dirty (unsaved) |
| Desktop / Partner Edit - Validation Error | `I8eU2` | Desktop | Field validation errors |
| Desktop / Partner Edit - Submitting | `u5yba` | Desktop | Submit pending |
| Desktop / Partner Edit - Saved Toast | `AmYek` | Desktop | Save success toast |
| Desktop / Partner Edit - Read Only | `KgJyC` | Desktop | RBAC read-only |
