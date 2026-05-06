# Sign In

Credential entry, validation feedback, and the post-sign-out / 401 return paths.

## How to navigate

This is the entry point — no prior login required.

1. Open the app at `/` (an unauthenticated visitor is redirected to `/sign-in`).
2. To reach the variant states from the default view:
   - **Field Validation** (`PTex7` / `suPCM`) — click **Sign in** with empty fields.
   - **Submitting** (`S1uiV6` / `loD9l`) — enter valid credentials and click **Sign in**.
   - **Invalid Credentials** (`AxGSO` / `shV2i`) — enter a wrong password and submit.
   - **Unverified Account** (`FvvlD` / `CoYws`) — sign in as a user whose email is not verified.
   - **Locked Out** (`H2lmy` / `hHoJI`) — submit invalid credentials repeatedly until the account locks.
   - **Returning (401)** (`TS6pZ`) — sign in normally, then let the session expire and revisit the app.
   - **401 Direct Link** (`AD3kT`) — open a deep link to a protected route while unauthenticated.
   - **Signed Out Toast** (`XnSO6`) — sign out from the profile menu, which redirects here with a confirmation toast.

## Designs

Frames in `docs/ui-design.pen`:

| Frame Name | Frame ID | Viewport | State |
| ---------- | -------- | -------- | ----- |
| Desktop / Sign In | `BNkiY` | Desktop 1440×1024 | Default |
| Desktop / Sign In - Field Validation | `PTex7` | Desktop | Empty / required field errors |
| Desktop / Sign In - Submitting | `S1uiV6` | Desktop | Submit pending |
| Desktop / Sign In - Invalid Credentials | `AxGSO` | Desktop | 401 invalid credentials |
| Desktop / Sign In - Unverified Account | `FvvlD` | Desktop | Account not verified |
| Desktop / Sign In - Locked Out | `H2lmy` | Desktop | Locked after repeated failures |
| Desktop / Sign In - Returning (401) | `TS6pZ` | Desktop | Re-auth from session expiry |
| Desktop / 401 Direct Link | `AD3kT` | Desktop | Direct unauthenticated nav |
| Desktop / Sign In - Signed Out Toast | `XnSO6` | Desktop | Toast after explicit sign out |
| Mobile / Sign In | `Q0xShp` | Mobile 375×812 | Default |
| Mobile / Sign In - Field Validation | `suPCM` | Mobile | Field errors |
| Mobile / Sign In - Submitting | `loD9l` | Mobile | Submit pending |
| Mobile / Sign In - Invalid Credentials | `shV2i` | Mobile | 401 invalid credentials |
| Mobile / Sign In - Unverified Account | `CoYws` | Mobile | Account not verified |
| Mobile / Sign In - Locked Out | `hHoJI` | Mobile | Locked after repeated failures |
