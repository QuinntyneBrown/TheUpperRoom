using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace TheUpperRoom.Api.Search;

[ApiController]
[Route("api/search")]
[Authorize]
public class SearchController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Search([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q) || q.Length < 2)
            return Ok(new { contacts = Array.Empty<object>(), partners = Array.Empty<object>(), hackathons = Array.Empty<object>(), members = Array.Empty<object>() });

        return Ok(await mediator.Send(new GlobalSearchQuery(q)));
    }
}
