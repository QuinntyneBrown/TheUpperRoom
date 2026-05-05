using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TheUpperRoom.Api.Dashboards;

[ApiController]
[Route("api/dashboards")]
[Authorize]
public class DashboardsController(IMediator mediator) : ControllerBase
{
    [HttpGet("me")]
    public async Task<IActionResult> Get()
    {
        return Ok(await mediator.Send(new GetMyDashboardQuery()));
    }

    [HttpPut("me")]
    public async Task<IActionResult> Save([FromBody] SaveDashboardRequest req)
    {
        await mediator.Send(new SaveDashboardCommand(req.Json));
        return Ok();
    }
}

public record SaveDashboardRequest(string Json);
