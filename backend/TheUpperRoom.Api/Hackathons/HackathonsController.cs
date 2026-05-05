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

public record AdvanceStageRequest(string ToStage);

[ApiController]
[Route("api/hackathons")]
[Authorize(Roles = $"{Roles.Admin},{Roles.CityLead},{Roles.PrayerLead},{Roles.EventLead},{Roles.CommunicationLead}")]
public class HackathonsController(IMediator mediator) : ControllerBase
{
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var dto = await mediator.Send(new GetHackathonQuery(id));
        if (dto is null) return NotFound(new { error = "not_found" });
        return Ok(dto);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateHackathonRequest req)
    {
        var id = await mediator.Send(new CreateHackathonCommand(
            req.Title, req.StartDate, req.EndDate, req.HostCity, req.PartnerIds));
        if (id is null) return NotFound(new { error = "partner_not_found" });
        return CreatedAtAction(nameof(Create), new { id }, new { id });
    }

    [HttpPost("{id:guid}/stage")]
    public async Task<IActionResult> AdvanceStage(Guid id, [FromBody] AdvanceStageRequest req)
    {
        if (!Enum.TryParse<HackathonStage>(req.ToStage, out var stage))
            return BadRequest(new { error = "invalid_stage" });
        var ok = await mediator.Send(new AdvanceHackathonStageCommand(id, stage));
        if (!ok) return NotFound(new { error = "not_found" });
        return Ok();
    }
}
