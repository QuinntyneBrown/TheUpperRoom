using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using TheUpperRoom.Api.Auth;
using TheUpperRoom.Api.Infrastructure;
using TheUpperRoom.Api.Realtime;

namespace TheUpperRoom.Api.Teams;

public record InviteMemberRequest(string Email, string[] Roles);
public record AssignRoleRequest(string Role, string Action);

[ApiController]
[Route("api/teams")]
[Authorize(Roles = $"{Roles.Admin},{Roles.CityLead},{Roles.PrayerLead},{Roles.EventLead},{Roles.CommunicationLead}")]
public class TeamsController(IMediator mediator, IHubContext<TeamHub> hub, ICurrentUser currentUser) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> List([FromQuery] int page = 1, [FromQuery] int size = 25, [FromQuery] string? search = null)
    {
        return Ok(await mediator.Send(new ListGlobalTeamsQuery(page, size, search)));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetTeam(Guid id)
    {
        var result = await mediator.Send(new GetGlobalTeamQuery(id));
        return result is null ? NotFound(new { error = "not_found" }) : Ok(result);
    }

    [HttpGet("local")]
    public async Task<IActionResult> Local()
    {
        return Ok(await mediator.Send(new GetLocalTeamQuery()));
    }

    [HttpPost("local/invitations")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.CityLead}")]
    public async Task<IActionResult> Invite([FromBody] InviteMemberRequest req)
    {
        await mediator.Send(new InviteMemberCommand(req.Email, req.Roles));
        return Ok();
    }

    [HttpDelete("local/members/{userId:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.CityLead}")]
    public async Task<IActionResult> RemoveMember(Guid userId)
    {
        var result = await mediator.Send(new RemoveMemberCommand(userId));
        return result switch
        {
            RemoveMemberResult.Ok => Ok(),
            RemoveMemberResult.Forbidden => Forbid(),
            _ => NotFound(new { error = "not_found" }),
        };
    }

    [HttpPost("local/members/{userId:guid}/roles")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.CityLead}")]
    public async Task<IActionResult> AssignRole(Guid userId, [FromBody] AssignRoleRequest req)
    {
        try
        {
            await mediator.Send(new AssignRoleCommand(userId, req.Role, req.Action));
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (KeyNotFoundException)
        {
            return NotFound(new { error = "not_found" });
        }
        await hub.Clients.Group($"team:{currentUser.TeamId}").SendAsync("roleChanged", new
        {
            eventType = "roleChanged",
            entityId = userId,
            actorId = currentUser.Id,
            timestamp = DateTime.UtcNow,
            role = req.Role,
            action = req.Action,
        });
        return Ok();
    }
}
