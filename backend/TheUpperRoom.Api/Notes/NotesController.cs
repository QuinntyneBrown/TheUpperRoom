using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TheUpperRoom.Api.Notes;

[ApiController]
[Route("api/notes")]
[Authorize]
public class NotesController(IMediator mediator) : ControllerBase
{
    [HttpPut("{noteId:guid}")]
    public async Task<IActionResult> Update(Guid noteId, [FromBody] UpdateNoteRequest req)
    {
        var result = await mediator.Send(new UpdateNoteCommand(noteId, req.Body));
        return result switch
        {
            null => NotFound(new { error = "not_found" }),
            false => StatusCode(403, new { error = "forbidden" }),
            _ => Ok()
        };
    }

    [HttpDelete("{noteId:guid}")]
    public async Task<IActionResult> Delete(Guid noteId)
    {
        var result = await mediator.Send(new DeleteNoteCommand(noteId));
        return result switch
        {
            null => NotFound(new { error = "not_found" }),
            false => StatusCode(403, new { error = "forbidden" }),
            _ => NoContent()
        };
    }
}

public record UpdateNoteRequest(string Body);
