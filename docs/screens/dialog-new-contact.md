# Dialog: New Contact

Create-contact dialog launched from the contacts list (modal on desktop/tablet, full-screen sheet on mobile).

## How to navigate

1. Sign in (see [sign-in](sign-in.md)).
2. Click **Contacts** in the side nav.
3. Click the **New Contact** button in the page header → opens the dialog (`s5uPzc` / `Xt0Un`).
4. To reach the variant states:
   - **Empty (Submit Disabled)** (`xwfZs`) — initial render with no fields filled.
   - **Required Errors** (`UAbTO`) — click **Save** with required fields empty.
   - **Malformed Email** (`d9Pt9`) — enter an invalid email and blur / submit.
   - **Malformed Phone** (`vuRV9`) — enter an invalid phone and blur / submit.
   - **Server Rejection** (`niGP8`) — submit a syntactically valid form that the server rejects (e.g. duplicate).

## Designs

Frames in `docs/ui-design.pen`:

| Frame Name | Frame ID | Viewport | State |
| ---------- | -------- | -------- | ----- |
| Dialog / New Contact | `s5uPzc` | Desktop 560×700 | Default |
| Mobile / New Contact | `Xt0Un` | Mobile 375×812 | Default sheet |
| Dialog / New Contact - Empty (Submit Disabled) | `xwfZs` | Desktop | Empty form, submit disabled |
| Dialog / New Contact - Required Errors | `UAbTO` | Desktop | Required-field errors |
| Dialog / New Contact - Malformed Email | `d9Pt9` | Desktop | Email format error |
| Dialog / New Contact - Malformed Phone | `vuRV9` | Desktop | Phone format error |
| Dialog / New Contact - Server Rejection | `niGP8` | Desktop | Server validation rejection |
