using MediatR;
using Microsoft.AspNetCore.Identity;
using TheUpperRoom.Api.Audit;
using TheUpperRoom.Api.Domain;

namespace TheUpperRoom.Api.Auth;

public record SignOutCommand : IRequest;

public class SignOutCommandHandler(
    SignInManager<User> signInManager,
    IAuditLog auditLog,
    IHttpContextAccessor httpContextAccessor) : IRequestHandler<SignOutCommand>
{
    public async Task Handle(SignOutCommand _, CancellationToken ct)
    {
        var userId = signInManager.UserManager.GetUserId(httpContextAccessor.HttpContext!.User);
        await signInManager.SignOutAsync();
        await auditLog.Write("signedOut", userId is null ? null : Guid.Parse(userId), new { });
    }
}
