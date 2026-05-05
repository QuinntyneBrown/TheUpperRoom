using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TheUpperRoom.Api.Notifications;

[ApiController]
[Route("api/notifications")]
[Authorize]
public class NotificationsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> List()
    {
        return Ok(await mediator.Send(new ListNotificationsQuery()));
    }

    [HttpPost("{id:guid}/read")]
    public async Task<IActionResult> MarkOne(Guid id)
    {
        await mediator.Send(new MarkReadCommand(id));
        return NoContent();
    }

    [HttpPost("read-all")]
    public async Task<IActionResult> MarkAll()
    {
        await mediator.Send(new MarkReadCommand(null));
        return NoContent();
    }
}
