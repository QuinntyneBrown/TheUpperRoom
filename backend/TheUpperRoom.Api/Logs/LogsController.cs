using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace TheUpperRoom.Api.Logs;

[ApiController]
public class LogsController(IMediator mediator) : ControllerBase
{
    [HttpPost("/api/logs")]
    public async Task<IActionResult> Post([FromBody] CreateLogCommand command)
    {
        await mediator.Send(command);
        return Ok();
    }
}
