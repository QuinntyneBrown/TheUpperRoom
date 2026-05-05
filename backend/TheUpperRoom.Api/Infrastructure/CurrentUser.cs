using System.Security.Claims;

namespace TheUpperRoom.Api.Infrastructure;

public interface ICurrentUser
{
    Guid? Id { get; }
    Guid? TeamId { get; }
    bool IsAdmin { get; }
    bool IsAuthenticated { get; }
    bool IsInRole(string role);
}

public class CurrentUser(IHttpContextAccessor httpContextAccessor) : ICurrentUser
{
    private ClaimsPrincipal? User => httpContextAccessor.HttpContext?.User;

    public Guid? Id =>
        Guid.TryParse(User?.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;

    public Guid? TeamId =>
        Guid.TryParse(User?.FindFirstValue("TeamId"), out var tid) ? tid : null;

    public bool IsAdmin => User?.IsInRole(Roles.Admin) ?? false;

    public bool IsAuthenticated => User?.Identity?.IsAuthenticated ?? false;

    public bool IsInRole(string role) => User?.IsInRole(role) ?? false;
}
