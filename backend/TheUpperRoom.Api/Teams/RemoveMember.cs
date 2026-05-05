using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;
using TheUpperRoom.Api.Realtime;

namespace TheUpperRoom.Api.Teams;

public record RemoveMemberCommand(Guid UserId) : IRequest<RemoveMemberResult>;

public enum RemoveMemberResult { Ok, NotFound, Forbidden }

public class RemoveMemberCommandHandler(
    UserManager<User> userManager,
    ICurrentUser currentUser,
    IHubContext<TeamHub> hub) : IRequestHandler<RemoveMemberCommand, RemoveMemberResult>
{
    public async Task<RemoveMemberResult> Handle(RemoveMemberCommand cmd, CancellationToken ct)
    {
        var target = await userManager.FindByIdAsync(cmd.UserId.ToString());
        if (target is null || target.TeamId != currentUser.TeamId) return RemoveMemberResult.NotFound;

        // City Lead cannot remove Admin or another CityLead
        if (!currentUser.IsAdmin)
        {
            var targetRoles = await userManager.GetRolesAsync(target);
            if (targetRoles.Contains(Roles.Admin) || targetRoles.Contains(Roles.CityLead))
                return RemoveMemberResult.Forbidden;
        }

        var roles = await userManager.GetRolesAsync(target);
        if (roles.Count > 0)
            await userManager.RemoveFromRolesAsync(target, roles);

        target.TeamId = null;
        target.LockoutEnd = DateTimeOffset.MaxValue;
        target.LockoutEnabled = true;
        await userManager.UpdateAsync(target);
        await userManager.UpdateSecurityStampAsync(target);

        await hub.Clients.Group($"team:{currentUser.TeamId}").SendAsync("teamMemberRemoved", new
        {
            eventType = "teamMemberRemoved",
            entityId = target.Id,
            actorId = currentUser.Id,
            timestamp = DateTime.UtcNow,
            userId = target.Id,
        }, ct);

        return RemoveMemberResult.Ok;
    }
}
