# Route Guard

Transient state shown by the router while resolving session before navigating to a protected route.

## How to navigate

This is a transient state — it is only visible while the route guard is awaiting the session check.

1. Open a deep link to a protected route (e.g. `/dashboard`) directly in a fresh tab while the cookie/session is being validated.
2. The guard renders this resolving state until the session check resolves, then either continues to the route or redirects to sign-in.

## Designs

Frames in `docs/ui-design.pen`:

| Frame Name | Frame ID | Viewport | State |
| ---------- | -------- | -------- | ----- |
| Desktop / Route Guard - Resolving Session | `D4Hayh` | Desktop 1440×1024 | Resolving |
