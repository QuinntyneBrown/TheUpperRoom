# Register

New account creation form with validation, password rule failures, and confirmation.

## How to navigate

No login required.

1. Open the app at `/sign-in`.
2. Click **Create account** → `/register`.
3. To reach the variant states:
   - **Invalid Fields** (`KgVnN`) — submit with one or more required fields empty or malformed.
   - **Password Failure** (`QbVBp`) — enter a password that violates the rules and submit.
   - **Submitting** (`pZ5zz`) — submit a valid form (the transient pending state).
   - **Generic Confirmation** (`b27XT5`) — after a successful submit, the confirmation page is shown.

## Designs

Frames in `docs/ui-design.pen`:

| Frame Name | Frame ID | Viewport | State |
| ---------- | -------- | -------- | ----- |
| Desktop / Register | `M2c3b` | Desktop 1440×1024 | Default |
| Desktop / Register - Invalid Fields | `KgVnN` | Desktop | Required / format errors |
| Desktop / Register - Password Failure | `QbVBp` | Desktop | Password rules not met |
| Desktop / Register - Submitting | `pZ5zz` | Desktop | Submit pending |
| Desktop / Register - Generic Confirmation | `b27XT5` | Desktop | Post-submit confirmation |
| Mobile / Register | `z8srV` | Mobile 375×812 | Default |
