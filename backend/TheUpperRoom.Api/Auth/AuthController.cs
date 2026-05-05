using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace TheUpperRoom.Api.Auth;

[ApiController]
[Route("api/auth")]
public class AuthController(IMediator mediator) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterCommand cmd)
    {
        await mediator.Send(cmd);
        return Ok(new { message = "If the email is new, a verification link has been sent." });
    }

    [HttpGet("verify")]
    public async Task<IActionResult> Verify([FromQuery] string token)
    {
        var result = await mediator.Send(new VerifyEmailCommand(token));
        if (!result.Success) return BadRequest(new { error = result.Error });
        return Redirect("/auth/sign-in");
    }
}
