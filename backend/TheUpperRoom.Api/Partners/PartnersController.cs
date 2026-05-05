using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;
using TheUpperRoom.Api.Notes;

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

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdatePartnerRequest req)
    {
        try
        {
            var found = await mediator.Send(new UpdatePartnerCommand(id, req.Name, req.City, req.Website, req.Description, req.Version));
            if (!found) return NotFound(new { error = "not_found" });
            return Ok();
        }
        catch (Contacts.ConflictException ex)
        {
            return Conflict(new { error = ex.Message });
        }
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.CityLead}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var found = await mediator.Send(new DeletePartnerCommand(id));
        if (!found) return NotFound(new { error = "not_found" });
        return NoContent();
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

    [HttpPost("{id:guid}/contacts")]
    public async Task<IActionResult> AddContact(Guid id, [FromBody] AddContactRequest req)
    {
        var found = await mediator.Send(new AddPartnerContactCommand(id, req.ContactId));
        if (!found) return NotFound(new { error = "not_found" });
        return Ok();
    }

    [HttpDelete("{id:guid}/contacts/{contactId:guid}")]
    public async Task<IActionResult> RemoveContact(Guid id, Guid contactId)
    {
        var found = await mediator.Send(new RemovePartnerContactCommand(id, contactId));
        if (!found) return NotFound(new { error = "not_found" });
        return NoContent();
    }

    [HttpPost("{id:guid}/contacts/new")]
    public async Task<IActionResult> CreateAndLinkContact(Guid id, [FromBody] CreateContactForPartnerRequest req)
    {
        var contactId = await mediator.Send(new CreateContactForPartnerCommand(id, req.FirstName, req.LastName, req.Email, req.Phone));
        if (contactId is null) return NotFound(new { error = "not_found" });
        return CreatedAtAction(nameof(CreateAndLinkContact), new { id, contactId }, new { contactId });
    }

    [HttpPost("{id:guid}/notes")]
    public async Task<IActionResult> AddNote(Guid id, [FromBody] AddPartnerNoteRequest req)
    {
        var note = await mediator.Send(new AddNoteCommand("Partner", id, req.Body));
        if (note is null) return NotFound(new { error = "not_found" });
        return Ok(note);
    }
}

public record ChangeStageRequest(string ToStage);
public record UpdatePartnerRequest(string Name, string City, string? Website, string? Description, int Version);
public record AddPartnerNoteRequest(string Body);
public record AddContactRequest(Guid ContactId);
public record CreateContactForPartnerRequest(string FirstName, string LastName, string? Email, string? Phone);

public record CreatePartnerRequest(
    string Name,
    string City,
    string? Website,
    PartnerStage? Stage,
    string? Description);
