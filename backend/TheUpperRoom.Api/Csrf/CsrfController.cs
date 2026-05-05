using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace TheUpperRoom.Api.Csrf;

[ApiController]
public class CsrfController(IMediator mediator) : ControllerBase
{
    [HttpGet("/api/csrf")]
    [IgnoreAntiforgeryToken]
    public async Task<IActionResult> GetToken()
    {
        await mediator.Send(new GetCsrfTokenQuery());
        return NoContent();
    }
}
