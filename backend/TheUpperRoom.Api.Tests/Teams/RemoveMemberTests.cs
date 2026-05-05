// Traces to: 27 — Remove Team Member
// L2-028: lower-role member removed; session invalidated; CityLead can't remove CityLead/Admin → 403
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Teams;

public class RemoveMemberTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<(string cookie, Guid userId, Guid teamId)> SignInAs(string role, Guid? teamId = null)
    {
        var tid = teamId ?? Guid.NewGuid();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"rm+{Guid.NewGuid():N}@example.com";
        const string password = "Str0ng!Pass#99";
        await client.PostAsJsonAsync("/api/auth/register", new { email, password, displayName = "User", city = "Toronto" });
        using var scope = factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var user = db.Users.First(u => u.Email == email);
        user.EmailConfirmed = true;
        user.TeamId = tid;
        await db.SaveChangesAsync();
        await userManager.AddToRoleAsync(user, role);
        var resp = await client.PostAsJsonAsync("/api/auth/sign-in", new { email, password });
        return (resp.Headers.GetValues("Set-Cookie").First().Split(';')[0], user.Id, tid);
    }

    [Fact]
    public async Task RemoveMember_CityLeadRemovesLowerRole_Returns200AndClearsTeam()
    {
        var (leadCookie, _, teamId) = await SignInAs(Roles.CityLead);
        var (_, memberId, _) = await SignInAs(Roles.PrayerLead, teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Delete, $"/api/teams/local/members/{memberId}");
        req.Headers.Add("Cookie", leadCookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var user = db.Users.Find(memberId);
        Assert.Null(user!.TeamId);

        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var roles = await userManager.GetRolesAsync(user);
        Assert.Empty(roles);
    }

    [Fact]
    public async Task RemoveMember_CityLeadRemovesCityLead_Returns403()
    {
        var (leadCookie, _, teamId) = await SignInAs(Roles.CityLead);
        var (_, otherId, _) = await SignInAs(Roles.CityLead, teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Delete, $"/api/teams/local/members/{otherId}");
        req.Headers.Add("Cookie", leadCookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }
}
