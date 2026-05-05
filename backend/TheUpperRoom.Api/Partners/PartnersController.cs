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
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePartnerRequest req)
    {
        var id = await mediator.Send(new CreatePartnerCommand(req.Name, req.City, req.Website, req.Stage, req.Description));
        return CreatedAtAction(nameof(Create), new { id }, new { id });
    }
}

public record CreatePartnerRequest(
    string Name,
    string City,
    string? Website,
    PartnerStage? Stage,
    string? Description);
