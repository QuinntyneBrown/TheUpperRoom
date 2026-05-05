// Traces to: 21 — Create Hackathon
// L2-022: persists with Discover stage; endDate<startDate rejected; partner associations persist
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Hackathons;

public class CreateHackathonTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<(string cookie, Guid teamId)> SignIn()
    {
        var teamId = Guid.NewGuid();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"ch+{Guid.NewGuid():N}@example.com";
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
    public async Task CreateHackathon_PersistsWithDiscoverStage()
    {
        var (cookie, _) = await SignIn();
        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, "/api/hackathons");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new
        {
            title = "City Hackathon 2026",
            startDate = "2026-06-01",
            endDate = "2026-06-03",
            hostCity = "Toronto",
            partnerIds = Array.Empty<Guid>()
        });

        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.NotNull(body!["id"]);

        // Verify stage defaulted to Discover
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var id = Guid.Parse(body["id"].ToString()!);
        var hackathon = await db.Hackathons.FindAsync(id);
        Assert.NotNull(hackathon);
        Assert.Equal(HackathonStage.Discover, hackathon!.Stage);
    }

    [Fact]
    public async Task CreateHackathon_EndDateBeforeStartDate_Returns400()
    {
        var (cookie, _) = await SignIn();
        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, "/api/hackathons");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new
        {
            title = "Bad Dates",
            startDate = "2026-06-05",
            endDate = "2026-06-01",
            hostCity = "Toronto",
            partnerIds = Array.Empty<Guid>()
        });

        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateHackathon_WithPartners_PartnerAssociationsPersist()
    {
        var (cookie, teamId) = await SignIn();

        // Seed a partner belonging to same team
        Guid partnerId;
        using (var scope = factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var partner = new Partner { TeamId = teamId, Name = "Test Church", City = "Toronto", Stage = PartnerStage.Lead };
            db.Partners.Add(partner);
            await db.SaveChangesAsync();
            partnerId = partner.Id;
        }

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, "/api/hackathons");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new
        {
            title = "Partnered Hackathon",
            startDate = "2026-07-01",
            endDate = "2026-07-03",
            hostCity = "Toronto",
            partnerIds = new[] { partnerId }
        });

        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        var hackathonId = Guid.Parse(body!["id"].ToString()!);

        using var verifyScope = factory.Services.CreateScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<AppDbContext>();
        var link = await verifyDb.HackathonPartners.FindAsync(hackathonId, partnerId);
        Assert.NotNull(link);
    }
}
