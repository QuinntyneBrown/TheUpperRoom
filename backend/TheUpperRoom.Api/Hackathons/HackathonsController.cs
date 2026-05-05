using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Hackathons;

public record CreateHackathonRequest(
    string Title,
    DateOnly StartDate,
    DateOnly EndDate,
    string HostCity,
    Guid[] PartnerIds);

[ApiController]
[Route("api/hackathons")]
[Authorize(Roles = $"{Roles.Admin},{Roles.CityLead},{Roles.PrayerLead},{Roles.EventLead},{Roles.CommunicationLead}")]
public class HackathonsController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateHackathonRequest req)
    {
        var id = await mediator.Send(new CreateHackathonCommand(
            req.Title, req.StartDate, req.EndDate, req.HostCity, req.PartnerIds));
        if (id is null) return NotFound(new { error = "partner_not_found" });
        return CreatedAtAction(nameof(Create), new { id }, new { id });
    }
}
