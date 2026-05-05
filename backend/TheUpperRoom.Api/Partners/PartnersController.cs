using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Partners;

[ApiController]
[Route("api/partners")]
[Authorize(Roles = $"{Roles.Admin},{Roles.CityLead},{Roles.PrayerLead},{Roles.EventLead},{Roles.CommunicationLead}")]
public class PartnersController(IMediator mediator) : ControllerBase
{
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var dto = await mediator.Send(new GetPartnerQuery(id));
        if (dto is null) return NotFound(new { error = "not_found" });
        return Ok(dto);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePartnerRequest req)
    {
        var id = await mediator.Send(new CreatePartnerCommand(req.Name, req.City, req.Website, req.Stage, req.Description));
        return CreatedAtAction(nameof(Create), new { id }, new { id });
    }

    [HttpPost("{id:guid}/stage")]
    public async Task<IActionResult> ChangeStage(Guid id, [FromBody] ChangeStageRequest req)
    {
        if (!Enum.TryParse<PartnerStage>(req.ToStage, out var stage))
            return BadRequest(new { error = "invalid_stage" });
        var found = await mediator.Send(new ChangePartnerStageCommand(id, stage));
        if (!found) return NotFound(new { error = "not_found" });
        return Ok();
    }
}

public record ChangeStageRequest(string ToStage);

public record CreatePartnerRequest(
    string Name,
    string City,
    string? Website,
    PartnerStage? Stage,
    string? Description);
