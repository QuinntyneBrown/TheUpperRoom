# 50 — SignalR Connection Lifecycle ✅ Complete

**Traces to:** L2-036. L1-008.

Vertical slice: client connects to `/hubs/team` on app init, reconnects with backoff, shows an offline banner during disconnect, and disconnects on sign-out. Event payloads and producers live in slice 51.

## Components

- Backend `Realtime/TeamHub.cs` — `[Authorize]` Hub at `/hubs/team`. `OnConnectedAsync` adds the connection to `team:{teamId}`. No client-callable methods.
- Frontend `api/realtime.service.ts` — wraps `HubConnectionBuilder().withUrl('/hubs/team', { accessTokenFactory })`. `IRetryPolicy` returns `[1000, 2000, 4000, 8000, 16000, 32000, 60000]` then 60000 forever.
- Frontend `realtime.service.connectionState$` — `BehaviorSubject<'connected'|'connecting'|'disconnected'>`.
- Frontend `app-shell` calls `realtime.connect()` after auth bootstrap and `realtime.disconnect()` on sign-out.
- Frontend `app-shell/offline-banner` shows when `connectionState === 'disconnected'` and hides when `connected`.

## Acceptance tests (L2-036)

- AC1: Connection established within 2 s of post-login bootstrap; banner not shown.
- AC2: Network drop → banner appears within 1 s; reconnect attempts back off `1s → 60s → 60s → ...`; on recovery, banner clears.
- AC3: Sign-out cancels reconnect attempts; no further requests to `/hubs/team` afterward.

## Radical simplicity notes

- One hub, one group, one service. No connection manager class.
- Banner is a single component bound to `connectionState$`; no dedicated notification surface.
- Backoff policy is hardcoded. Tunability is not a requirement.
