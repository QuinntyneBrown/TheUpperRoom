using MediatR;
using Microsoft.AspNetCore.Authorization;
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

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me() => Ok(new { email = User.Identity?.Name });

    [Authorize]
    [HttpPost("sign-out")]
    public new async Task<IActionResult> SignOut()
    {
        await mediator.Send(new SignOutCommand());
        return Ok(new { message = "Signed out." });
    }

    [HttpPost("recovery")]
    [EnableRateLimiting("recovery-email")]
    public async Task<IActionResult> Recovery([FromBody] RequestRecoveryCommand cmd)
    {
        await mediator.Send(cmd);
        return Ok(new { message = "If the email is registered, a reset link has been sent." });
    }

    [HttpPost("reset")]
    public async Task<IActionResult> Reset([FromBody] ResetPasswordCommand cmd)
    {
        var result = await mediator.Send(cmd);
        if (!result.Success) return BadRequest(new { error = result.Error });
        return Ok(new { message = "Password reset." });
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
