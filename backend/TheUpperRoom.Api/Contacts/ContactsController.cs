using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheUpperRoom.Api.Infrastructure;
using TheUpperRoom.Api.Notes;

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

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] string? search)
    {
        if (!string.IsNullOrWhiteSpace(search))
        {
            if (search.Length < 2) return Ok(Array.Empty<object>());
            var results = await mediator.Send(new SearchContactsQuery(search));
            return Ok(results);
        }
        return Ok(Array.Empty<object>());
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var dto = await mediator.Send(new GetContactQuery(id));
        if (dto is null) return NotFound(new { error = "not_found" });
        return Ok(dto);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateContactRequest req)
    {
        var found = await mediator.Send(new UpdateContactCommand(
            id, req.FirstName, req.LastName, req.Email, req.Phone, req.City, req.Version));
        if (!found) return NotFound(new { error = "not_found" });
        return Ok();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.CityLead}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var found = await mediator.Send(new DeleteContactCommand(id));
        if (!found) return NotFound(new { error = "not_found" });
        return NoContent();
    }

    [HttpPost("{id:guid}/notes")]
    public async Task<IActionResult> AddNote(Guid id, [FromBody] AddNoteRequest req)
    {
        var dto = await mediator.Send(new AddNoteCommand("Contact", id, req.Body));
        if (dto is null) return NotFound(new { error = "not_found" });
        return CreatedAtAction(nameof(AddNote), new { id }, dto);
    }
}

public record AddNoteRequest(string Body);

public record UpdateContactRequest(
    string FirstName,
    string LastName,
    int Version,
    string? Email,
    string? Phone,
    string? City);

public record CreateContactRequest(
    string FirstName,
    string LastName,
    Guid? TeamId,
    string? Email,
    string? Phone,
    string? City,
    string? Notes);
