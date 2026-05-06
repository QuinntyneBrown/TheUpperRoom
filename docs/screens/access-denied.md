# Access Denied

Shown when an authenticated user lacks permission for the requested route.

## How to navigate

1. Sign in as a user **without** the role required for a protected route (e.g. a viewer trying to reach an admin-only page).
2. Navigate to that protected route — the route guard redirects to `/access-denied`.

## Designs

Frames in `docs/ui-design.pen`:

| Frame Name | Frame ID | Viewport | State |
| ---------- | -------- | -------- | ----- |
| Desktop / Access Denied | `PEnbv` | Desktop 1440×1024 | Default |
| Mobile / Access Denied | `HWZbe` | Mobile 375×812 | Default |
