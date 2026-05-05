// Traces to: 25 — View Local Team
// L2-026: members shown with role columns; sorted by role then last name
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Teams;

public class GetLocalTeamTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<(string cookie, Guid teamId)> SignInAsLead()
    {
        var teamId = Guid.NewGuid();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"glt+{Guid.NewGuid():N}@example.com";
        const string password = "Str0ng!Pass#99";
        await client.PostAsJsonAsync("/api/auth/register",
            new { email, password, displayName = "City Lead", city = "Toronto" });
        using var scope = factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var user = db.Users.First(u => u.Email == email);
        user.EmailConfirmed = true;
        user.TeamId = teamId;
        await db.SaveChangesAsync();
        await userManager.AddToRoleAsync(user, Roles.CityLead);
        var resp = await client.PostAsJsonAsync("/api/auth/sign-in", new { email, password });
        return (resp.Headers.GetValues("Set-Cookie").First().Split(';')[0], teamId);
    }

    private async Task SeedTeamMember(Guid teamId, string role)
    {
        using var scope = factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var email = $"tm+{Guid.NewGuid():N}@example.com";
        var user = new User { UserName = email, Email = email, DisplayName = "Member", City = "Toronto", EmailConfirmed = true, TeamId = teamId };
        await userManager.CreateAsync(user, "Str0ng!Pass#99");
        await userManager.AddToRoleAsync(user, role);
    }

    [Fact]
    public async Task GetLocalTeam_ReturnsMembersWithRoles()
    {
        var (cookie, teamId) = await SignInAsLead();
        await SeedTeamMember(teamId, Roles.PrayerLead);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/teams/local");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<List<Dictionary<string, object>>>();
        Assert.NotNull(body);
        Assert.True(body!.Count >= 2); // lead + seeded member
        Assert.All(body, m => Assert.NotNull(m["displayName"]));
        Assert.All(body, m => Assert.NotNull(m["role"]));
        Assert.All(body, m => Assert.NotNull(m["email"]));
    }
}
