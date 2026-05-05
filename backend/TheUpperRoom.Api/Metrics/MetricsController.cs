using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TheUpperRoom.Api.Metrics;

[ApiController]
[Route("api/metrics")]
[Authorize]
public class MetricsController(IMediator mediator) : ControllerBase
{
    [HttpGet("{metric}")]
    public async Task<IActionResult> Get(
        string metric,
        [FromQuery] DateTime from,
        [FromQuery] DateTime to,
        [FromQuery] string bucket = "day")
    {
        var result = await mediator.Send(new GetMetricQuery(metric, from.ToUniversalTime(), to.ToUniversalTime(), bucket));
        return result is null ? BadRequest(new { error = "unknown_metric" }) : Ok(result);
    }
}
