# 32 — SignalR Connection Lifecycle & Push Events

**Traces to:** L2-036, L2-037, L2-048 (L1-008, L1-013).

## Components
- Backend `Realtime/TeamHub.cs` — `[Authorize]` SignalR Hub at `/hubs/team`. `OnConnectedAsync`: read `CurrentUser.TeamId`, `Groups.AddToGroupAsync(connectionId, $"team:{teamId}")`. No methods invoked from clients — server is publish-only.
- Backend `Realtime/Broadcast.cs` — small static helper:
  ```csharp
  await hub.Clients.Group($"team:{teamId}").SendAsync(eventName, payload);
  ```
  Called from the handlers that need to publish (slices 08, 16, 22, 27, 28, 33).
- Frontend `api/realtime.service.ts` — wraps `@microsoft/signalr.HubConnectionBuilder` with `.withAutomaticReconnect([1000, 2000, 4000, 8000, 16000, 32000, 60000, 60000, ...])`. Exposes `on(event, handler)` returning an unsubscribe and `connect()` / `disconnect()`.
- Frontend `app-shell` calls `realtime.connect()` on app init when authenticated, `realtime.disconnect()` on sign-out.

## Events catalog (initial)

| Event | Payload | Producer slice |
|---|---|---|
| `contactCreated` | `{ contactId, actorId }` | 08 |
| `partnerStageChanged` | `{ partnerId, fromStage, toStage }` | 16 |
| `hackathonStageChanged` | `{ hackathonId, fromStage, toStage }` | 22 |
| `noteAdded` | `{ targetType, targetId, noteId }` | 12, 18 |
| `teamMemberAdded` / `teamMemberRemoved` | `{ userId }` | 26, 27 |
| `roleChanged` | `{ userId, roles[] }` | 28 |
| `metricInvalidated:{metric}` | `{}` | every mutator that affects metrics |

## Workflow
![Sequence](diagrams/sequence_realtime.png)

## Acceptance tests
- L2-036 AC1: connection established within 2 s of bootstrap; user joined `team:{teamId}` group.
- L2-036 AC2: connection drop triggers reconnect with exponential backoff up to 60 s, indefinitely.
- L2-036 AC3: sign-out disconnects and cancels reconnect attempts.
- L2-037 AC1: events delivered to other team members within 2 s.
- L2-037 AC2: open partner-detail screen reflects matching event within 500 ms.

## Radical simplicity notes
- One hub, one group naming convention (`team:{id}`), one publish helper. No back-end pub/sub; the Hub itself is the bus.
- Clients are publish targets only — they never invoke hub methods. This eliminates a whole class of authorization concerns on the hub.
