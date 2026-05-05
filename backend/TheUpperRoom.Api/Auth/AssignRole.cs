using MediatR;
using Microsoft.AspNetCore.Identity;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Auth;

public record AssignRoleCommand(Guid TargetUserId, string Role, string Action) : IRequest;

public class AssignRoleCommandHandler(
    UserManager<User> userManager,
    ICurrentUser currentUser) : IRequestHandler<AssignRoleCommand>
{
    public async Task Handle(AssignRoleCommand cmd, CancellationToken ct)
    {
        var isAdmin = currentUser.IsAdmin;
        var isCityLead = userManager.GetRolesAsync(
            (await userManager.FindByIdAsync(currentUser.Id!.ToString()!))!).Result.Contains(Roles.CityLead);

        if (!isAdmin && !isCityLead)
            throw new UnauthorizedAccessException("Only Admin or CityLead can assign roles.");

        if (!isAdmin && !Roles.SubordinateRoles.Contains(cmd.Role))
            throw new UnauthorizedAccessException("CityLead can only assign subordinate roles.");

        var target = await userManager.FindByIdAsync(cmd.TargetUserId.ToString());
        if (target is null) throw new KeyNotFoundException("User not found.");

        if (cmd.Action == "add")
            await userManager.AddToRoleAsync(target, cmd.Role);
        else
            await userManager.RemoveFromRoleAsync(target, cmd.Role);
    }
}
