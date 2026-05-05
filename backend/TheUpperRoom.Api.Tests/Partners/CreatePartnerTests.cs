// Traces to: 15 — Create Partner
// L2-016: partner persists within 1s, defaults stage to Lead, attributed to actor's team
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Partners;

public class CreatePartnerTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<(string cookie, Guid teamId)> SignInAsTeamMember()
    {
        var teamId = Guid.NewGuid();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"partner+{Guid.NewGuid():N}@example.com";
        const string password = "Str0ng!Pass#99";
        await client.PostAsJsonAsync("/api/auth/register",
            new { email, password, displayName = "Lead", city = "Toronto" });
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

    [Fact]
    public async Task Create_ValidRequest_Returns201WithId()
    {
        var (cookie, teamId) = await SignInAsTeamMember();
        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, "/api/partners");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { name = "FaithTech Toronto", city = "Toronto" });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.True(body!.ContainsKey("id"));
    }

    [Fact]
    public async Task Create_DefaultsStageToLead()
    {
        var (cookie, teamId) = await SignInAsTeamMember();
        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, "/api/partners");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { name = "East Side Outreach", city = "Ottawa" });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        var id = Guid.Parse(body!["id"].ToString()!);

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var partner = db.Partners.First(p => p.Id == id);
        Assert.Equal(PartnerStage.Lead, partner.Stage);
        Assert.Equal(teamId, partner.TeamId);
    }

    [Fact]
    public async Task Create_MalformedWebsite_Returns400()
    {
        var (cookie, _) = await SignInAsTeamMember();
        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, "/api/partners");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { name = "Test Org", city = "Calgary", website = "not-a-url" });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Create_MissingName_Returns400()
    {
        var (cookie, _) = await SignInAsTeamMember();
        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, "/api/partners");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { name = "", city = "Calgary" });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
