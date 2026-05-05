# 60 — Audit Logging for Sensitive Domain Events

**Traces to:** L2-044 AC3. L1-011, L1-002.

Vertical slice: a single audit helper called from sign-in, sign-out, role assignment, delete, restore, lockout, and throttle paths.

## Components

- Backend `Audit/IAuditLog.cs` — `Task Write(string eventType, Guid? targetId, object data)`.
- Backend `Audit/AuditLog.cs` — writes a structured Serilog event with `Category=Audit` and the current correlation/user/team IDs:
  ```
  { category: "Audit", eventType, actorId, teamId, targetId, correlationId, timestamp, data }
  ```
- Call sites:
  - `SignIn` → `userSignedIn` / `userSignInFailed`.
  - `SignOut` → `userSignedOut`.
  - `AssignRole` / `RevokeRole` → `roleAssigned` / `roleRevoked`.
  - Soft-delete handlers (contact, partner, hackathon) → `<entity>Deleted`.
  - Restore handlers → `<entity>Restored`.
  - Lockout in `SignIn` → `accountLockedOut`.
  - Rate-limit middleware (slice 70) → `rateLimited`.

## Acceptance tests (L2-044 AC3)

- Each enumerated action emits exactly one audit log entry with all six identity fields populated.
- Audit entries appear in the same Serilog stream but are tagged `Category=Audit` for retention/extraction.

## Radical simplicity notes

- Audit is a tagged log channel, not a separate database table. Retention/extraction is a log-pipeline concern.
- The helper is the only allowed call site; producers cannot omit fields.
