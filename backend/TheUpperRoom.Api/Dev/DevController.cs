using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Dev;

[ApiController]
[Route("api/dev")]
[AllowAnonymous]
public class DevController(UserManager<User> userManager, AppDbContext db, IWebHostEnvironment env) : ControllerBase
{
    static readonly Guid TestTeamId = Guid.Parse("00000000-0000-0000-0000-000000000001");
    const string TestPassword = "Str0ng!Pass#99";

    [HttpPost("seed")]
    public async Task<IActionResult> Seed()
    {
        if (!env.IsDevelopment()) return NotFound();

        var cityLead = await EnsureUser("cityLead@test.com", "City Lead", TestTeamId, Roles.CityLead);
        await EnsureUser("admin@test.com", "Admin User", TestTeamId, Roles.Admin);

        // Reset city-lead dashboard so assertEmpty() always starts clean
        var layout = await db.DashboardLayouts.FindAsync(cityLead.Id);
        if (layout is not null)
        {
            layout.Json = """{"items":[]}""";
            await db.SaveChangesAsync();
        }

        return Ok(new { seeded = true });
    }

    private async Task<User> EnsureUser(string email, string displayName, Guid? teamId, string role)
    {
        var user = await userManager.FindByEmailAsync(email);
        if (user is null)
        {
            user = new User
            {
                Email = email,
                UserName = email,
                DisplayName = displayName,
                City = "Test City",
                TeamId = teamId,
                EmailConfirmed = true,
            };
            await userManager.CreateAsync(user, TestPassword);
        }
        if (!await userManager.IsInRoleAsync(user, role))
            await userManager.AddToRoleAsync(user, role);
        return user;
    }
}
