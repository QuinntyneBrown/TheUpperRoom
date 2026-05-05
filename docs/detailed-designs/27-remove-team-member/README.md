# 27 — Remove Team Member

**Traces to:** L2-028 (L1-006).

## Components
- Backend `Teams/RemoveMember.cs` — `RemoveMemberCommand : ITeamScopedRequest { TargetTeamId, UserId }`. Revokes all roles on that team for that user, sets `User.TeamId = null`, sets `User.IsActive = false`, bumps the security stamp via `UserManager.UpdateSecurityStampAsync` to terminate active sessions, and broadcasts `teamMemberRemoved` through the standard realtime envelope.
- Backend `TeamsController.Remove` — `DELETE /api/teams/local/members/{userId}`. `[Authorize(Roles="Admin,CityLead")]` plus per-handler check: City Lead may not remove another City Lead or Admin.
- Frontend confirm dialog from `components`.

## Workflow
![Sequence](diagrams/sequence_remove.png)

## Acceptance tests (L2-028)
- City Lead removes lower-role member; their session ends; other team members see realtime update.
- City Lead removing another City Lead or Admin → 403.
- The pushed event payload includes event type, entity ID, actor ID, and timestamp.

## Radical simplicity notes
- "End active session" is `UpdateSecurityStampAsync` — Identity invalidates cookies on next request automatically.

## Decision
- Removed users are not deleted. The system keeps the user row for auditability, clears `TeamId`, sets `IsActive=false`, revokes team roles, and allows future re-invitation.
