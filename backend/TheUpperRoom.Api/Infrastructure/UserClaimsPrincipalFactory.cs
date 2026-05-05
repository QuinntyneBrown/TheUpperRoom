using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using TheUpperRoom.Api.Domain;

namespace TheUpperRoom.Api.Infrastructure;

public class AppUserClaimsPrincipalFactory(
    UserManager<User> userManager,
    RoleManager<IdentityRole<Guid>> roleManager,
    IOptions<IdentityOptions> options)
    : UserClaimsPrincipalFactory<User, IdentityRole<Guid>>(userManager, roleManager, options)
{
    protected override async Task<ClaimsIdentity> GenerateClaimsAsync(User user)
    {
        var identity = await base.GenerateClaimsAsync(user);
        if (user.TeamId.HasValue)
            identity.AddClaim(new Claim("TeamId", user.TeamId.Value.ToString()));
        return identity;
    }
}
