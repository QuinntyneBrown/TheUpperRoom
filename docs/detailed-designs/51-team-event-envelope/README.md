# 51 — Team Event Envelope Contract ✅ Complete

**Traces to:** L2-037. L1-008.

Vertical slice: every server-pushed team event uses the same envelope, enforced by one publish helper. One producer (contact created) and one consumer (a toast in the contacts list) prove the path.

## Components

- Backend `Realtime/TeamEvent.cs` — record `{ EventType, EntityId, ActorId, Timestamp, Data }`.
- Backend `Realtime/Broadcast.cs` — single helper:
  ```csharp
  public Task Publish<T>(string eventType, Guid teamId, Guid entityId, T data) =>
      hub.Clients.Group($"team:{teamId}").SendAsync(eventType, new TeamEvent {
          EventType = eventType, EntityId = entityId, ActorId = currentUser.Id,
          Timestamp = clock.UtcNow, Data = data });
  ```
- Backend slice 08 `CreateContact` handler calls `broadcast.Publish("contactCreated", teamId, contact.Id, new { contact.Id })`.
- Frontend `realtime.service.on('contactCreated', envelope => …)` — toast and re-fetch contact list.
- Backend contract tests assert: every event sent through `Broadcast.Publish` produces a JSON payload with all five envelope fields, non-null.

## Envelope schema

```json
{
  "eventType": "string",
  "entityId": "guid",
  "actorId": "guid",
  "timestamp": "iso8601",
  "data": { /* event-specific */ }
}
```

## Acceptance tests (L2-037)

- AC1: A contact created on client A is received by client B in the same team within 2 s.
- AC2: A contact created on client A is received by client A's open contacts list within 500 ms.
- AC3 (contract): every published envelope includes `eventType`, `entityId`, `actorId`, `timestamp`, and `data`.

## Radical simplicity notes

- One helper is the only way to publish; producers cannot construct envelopes themselves.
- The catalog of event types is a string convention; no shared event-name enum is required.
- One producer + one consumer is enough to prove the contract. New events copy the call site.
