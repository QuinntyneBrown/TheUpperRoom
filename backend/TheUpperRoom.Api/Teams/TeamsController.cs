using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Teams;

public record InviteMemberRequest(string Email, string[] Roles);

[ApiController]
[Route("api/teams")]
[Authorize(Roles = $"{Roles.Admin},{Roles.CityLead},{Roles.PrayerLead},{Roles.EventLead},{Roles.CommunicationLead}")]
public class TeamsController(IMediator mediator) : ControllerBase
{
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
}
