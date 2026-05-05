using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace TheUpperRoom.Api.Health;

[ApiController]
public class HealthController(IMediator mediator) : ControllerBase
{
    [HttpGet("/api/health")]
    public async Task<GetHealthResult> Get() => await mediator.Send(new GetHealthQuery());
}
