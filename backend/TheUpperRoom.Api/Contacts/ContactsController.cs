using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Contacts;

[ApiController]
[Route("api/contacts")]
[Authorize(Roles = $"{Roles.Admin},{Roles.CityLead},{Roles.PrayerLead},{Roles.EventLead},{Roles.CommunicationLead}")]
public class ContactsController(IMediator mediator) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateContactRequest req)
    {
        var id = await mediator.Send(new CreateContactCommand(
            req.TeamId,
            req.FirstName,
            req.LastName,
            req.Email,
            req.Phone,
            req.City,
            req.Notes));
        return CreatedAtAction(nameof(Get), new { id }, new { id });
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var dto = await mediator.Send(new GetContactQuery(id));
        if (dto is null) return NotFound(new { error = "not_found" });
        return Ok(dto);
    }
}

public record CreateContactRequest(
    string FirstName,
    string LastName,
    Guid? TeamId,
    string? Email,
    string? Phone,
    string? City,
    string? Notes);
