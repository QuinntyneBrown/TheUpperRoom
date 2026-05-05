using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Auth;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController(IMediator mediator) : ControllerBase
{
    [HttpPost("{id:guid}/roles")]
    [Authorize(Roles = $"{Roles.Admin},{Roles.CityLead}")]
    public async Task<IActionResult> AssignRole(Guid id, [FromBody] AssignRoleRequest req)
    {
        await mediator.Send(new AssignRoleCommand(id, req.Role, req.Action));
        return Ok(new { message = "Role updated." });
    }
}

public record AssignRoleRequest(string Role, string Action);
