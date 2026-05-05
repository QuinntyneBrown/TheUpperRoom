// Traces to: 28 — Assign / Revoke Team Role
// L2-029: CityLead toggles subordinate roles; CityLead/Admin role → 403
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Teams;

public class AssignRoleTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<(string cookie, Guid userId, Guid teamId)> SignInAs(string role, Guid? teamId = null)
    {
        var tid = teamId ?? Guid.NewGuid();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"ar+{Guid.NewGuid():N}@example.com";
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
    public async Task AssignRole_CityLeadAssignsSubordinateRole_Returns200AndPersists()
    {
        var (leadCookie, _, teamId) = await SignInAs(Roles.CityLead);
        var (_, memberId, _) = await SignInAs(Roles.EventLead, teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, $"/api/teams/local/members/{memberId}/roles");
        req.Headers.Add("Cookie", leadCookie);
        req.Content = JsonContent.Create(new { role = Roles.PrayerLead, action = "add" });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var scope = factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var user = db.Users.Find(memberId);
        var roles = await userManager.GetRolesAsync(user!);
        Assert.Contains(Roles.PrayerLead, roles);
    }

    [Fact]
    public async Task AssignRole_CityLeadAssignsCityLeadRole_Returns403()
    {
        var (leadCookie, _, teamId) = await SignInAs(Roles.CityLead);
        var (_, memberId, _) = await SignInAs(Roles.PrayerLead, teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, $"/api/teams/local/members/{memberId}/roles");
        req.Headers.Add("Cookie", leadCookie);
        req.Content = JsonContent.Create(new { role = Roles.CityLead, action = "add" });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }
}
