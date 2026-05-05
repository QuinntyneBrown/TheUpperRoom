// Traces to: 24 — View Hackathon Details
// L2-025: full detail renders; cross-team returns 404; partners + history included
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Hackathons;

public class GetHackathonTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<(string cookie, Guid userId, Guid teamId)> SignIn()
    {
        var teamId = Guid.NewGuid();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"gh+{Guid.NewGuid():N}@example.com";
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

    private async Task<Guid> SeedHackathonWithPartner(Guid teamId)
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var partner = new Partner { TeamId = teamId, Name = "FaithTech", City = "Toronto", Stage = PartnerStage.Confirmed };
        db.Partners.Add(partner);
        var h = new Hackathon
        {
            TeamId = teamId,
            Title = "Detail Hackathon",
            StartDate = new DateOnly(2026, 8, 1),
            EndDate = new DateOnly(2026, 8, 3),
            HostCity = "Toronto",
        };
        db.Hackathons.Add(h);
        db.HackathonPartners.Add(new HackathonPartner { HackathonId = h.Id, PartnerId = partner.Id });
        await db.SaveChangesAsync();
        return h.Id;
    }

    [Fact]
    public async Task GetHackathon_ReturnsFullDetail()
    {
        var (cookie, _, teamId) = await SignIn();
        var hackathonId = await SeedHackathonWithPartner(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, $"/api/hackathons/{hackathonId}");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.NotNull(body!["id"]);
        Assert.NotNull(body["title"]);
        Assert.NotNull(body["partners"]);
        Assert.NotNull(body["history"]);
        Assert.NotNull(body["products"]);
    }

    [Fact]
    public async Task GetHackathon_CrossTeam_Returns404()
    {
        var (cookie, _, _) = await SignIn();
        // Seed a hackathon for a different team
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var h = new Hackathon
        {
            TeamId = Guid.NewGuid(),
            Title = "Other Team Hackathon",
            StartDate = new DateOnly(2026, 9, 1),
            EndDate = new DateOnly(2026, 9, 3),
            HostCity = "Vancouver",
        };
        db.Hackathons.Add(h);
        await db.SaveChangesAsync();

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, $"/api/hackathons/{h.Id}");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
