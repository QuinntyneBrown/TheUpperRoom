// Traces to: 29 — View & Search Global Teams
// L2-030: paginated global team list with public summary fields
// L2-031: search by city or member name
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Teams;

public class GlobalTeamsTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<(string cookie, Guid userId, Guid teamId)> SignInAs(string role, Guid? teamId = null, string city = "Ottawa")
    {
        var tid = teamId ?? Guid.NewGuid();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"gt+{Guid.NewGuid():N}@example.com";
        const string password = "Str0ng!Pass#99";
        await client.PostAsJsonAsync("/api/auth/register", new { email, password, displayName = "User", city });
        using var scope = factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var user = db.Users.First(u => u.Email == email);
        user.EmailConfirmed = true;
        user.TeamId = tid;
        user.City = city;
        await db.SaveChangesAsync();
        await userManager.AddToRoleAsync(user, role);
        var resp = await client.PostAsJsonAsync("/api/auth/sign-in", new { email, password });
        return (resp.Headers.GetValues("Set-Cookie").First().Split(';')[0], user.Id, tid);
    }

    [Fact]
    public async Task ListGlobalTeams_Admin_ReturnsPaginatedRowsWithSummaryFields()
    {
        var (adminCookie, _, _) = await SignInAs(Roles.Admin);
        var (_, _, teamId) = await SignInAs(Roles.CityLead, city: "Toronto");

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/teams?page=1&size=25");
        req.Headers.Add("Cookie", adminCookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.NotNull(body);
        Assert.True(body!.ContainsKey("rows"));
        Assert.True(body.ContainsKey("total"));
    }

    [Fact]
    public async Task ListGlobalTeams_SearchByCity_ReturnsMatchingTeam()
    {
        var (adminCookie, _, _) = await SignInAs(Roles.Admin);
        await SignInAs(Roles.CityLead, city: "Vancouver");

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/teams?search=Vancouver");
        req.Headers.Add("Cookie", adminCookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.NotNull(body);
        var rows = System.Text.Json.JsonSerializer.Deserialize<List<Dictionary<string, object>>>(body!["rows"].ToString()!);
        Assert.NotNull(rows);
        Assert.Contains(rows, r => r["city"].ToString()!.Contains("Vancouver", StringComparison.OrdinalIgnoreCase));
    }

    [Fact]
    public async Task GetGlobalTeam_NonAdmin_ReturnsPublicSummaryOnly()
    {
        var teamId = Guid.NewGuid();
        var (leadCookie, _, _) = await SignInAs(Roles.CityLead, teamId, city: "Calgary");

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, $"/api/teams/{teamId}");
        req.Headers.Add("Cookie", leadCookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.NotNull(body);
        Assert.True(body!.ContainsKey("city"));
        Assert.True(body.ContainsKey("memberCount"));
        Assert.False(body.ContainsKey("members"), "Non-admin must not see member list");
    }

    [Fact]
    public async Task GetGlobalTeam_Admin_ReturnsFullDetailWithMembers()
    {
        var teamId = Guid.NewGuid();
        await SignInAs(Roles.CityLead, teamId, city: "Edmonton");
        var (adminCookie, _, _) = await SignInAs(Roles.Admin);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, $"/api/teams/{teamId}");
        req.Headers.Add("Cookie", adminCookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.NotNull(body);
        Assert.True(body!.ContainsKey("members"), "Admin should see member list");
    }
}
