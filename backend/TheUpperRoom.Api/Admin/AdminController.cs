using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Admin;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = Roles.Admin)]
public class AdminController(IMediator mediator) : ControllerBase
{
    [HttpPost("contacts/{id:guid}/restore")]
    public async Task<IActionResult> RestoreContact(Guid id)
    {
        var found = await mediator.Send(new RestoreContactCommand(id));
        if (!found) return NotFound(new { error = "not_found" });
        return Ok(new { message = "Contact restored." });
    }
}
