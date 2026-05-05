// Traces to: 22 — Track 4 D's Process Stage
// L2-023: advance/retreat persists; history appended; cross-team rejected; event payload correct
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Hackathons;

public class AdvanceStageTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<(string cookie, Guid userId, Guid teamId)> SignIn()
    {
        var teamId = Guid.NewGuid();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"as+{Guid.NewGuid():N}@example.com";
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
        return (resp.Headers.GetValues("Set-Cookie").First().Split(';')[0], user.Id, teamId);
    }

    private async Task<Guid> SeedHackathon(Guid teamId, HackathonStage stage = HackathonStage.Discover)
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var h = new Hackathon
        {
            TeamId = teamId,
            Title = "Test Hackathon",
            StartDate = new DateOnly(2026, 6, 1),
            EndDate = new DateOnly(2026, 6, 3),
            HostCity = "Toronto",
            Stage = stage,
        };
        db.Hackathons.Add(h);
        await db.SaveChangesAsync();
        return h.Id;
    }

    [Fact]
    public async Task AdvanceStage_PersistsAndAppendsHistory()
    {
        var (cookie, userId, teamId) = await SignIn();
        var hackathonId = await SeedHackathon(teamId, HackathonStage.Discover);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, $"/api/hackathons/{hackathonId}/stage");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { toStage = "Define" });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var hackathon = await db.Hackathons.FindAsync(hackathonId);
        Assert.Equal(HackathonStage.Define, hackathon!.Stage);

        var history = db.HackathonStageHistories.Where(h => h.HackathonId == hackathonId).ToList();
        Assert.Single(history);
        Assert.Equal(HackathonStage.Discover, history[0].FromStage);
        Assert.Equal(HackathonStage.Define, history[0].ToStage);
        Assert.Equal(userId, history[0].ChangedById);
    }

    [Fact]
    public async Task AdvanceStage_CrossTeam_Returns404()
    {
        var (cookie, _, _) = await SignIn();
        var hackathonId = await SeedHackathon(Guid.NewGuid()); // different team

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, $"/api/hackathons/{hackathonId}/stage");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { toStage = "Define" });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task AdvanceStage_InvalidStage_Returns400()
    {
        var (cookie, _, teamId) = await SignIn();
        var hackathonId = await SeedHackathon(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, $"/api/hackathons/{hackathonId}/stage");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { toStage = "Unknown" });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
