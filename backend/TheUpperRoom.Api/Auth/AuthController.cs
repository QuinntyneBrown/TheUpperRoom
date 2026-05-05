using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

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

    [HttpPost("sign-in")]
    [EnableRateLimiting("sign-in-ip")]
    public async Task<IActionResult> SignIn([FromBody] SignInCommand cmd)
    {
        var result = await mediator.Send(cmd);
        return result.Status switch
        {
            SignInResultStatus.Ok => Ok(new { message = "Signed in." }),
            SignInResultStatus.VerificationRequired => StatusCode(403, new { error = "verification_required" }),
            _ => Unauthorized(new { error = "invalid_credentials" }),
        };
    }
}
