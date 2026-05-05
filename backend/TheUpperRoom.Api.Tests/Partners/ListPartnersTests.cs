// Traces to: 20 — Partner Funnel Board
// L2-021: list returns team partners; stage filter works; cross-team excluded
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Partners;

public class ListPartnersTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<(string cookie, Guid teamId)> SignIn()
    {
        var teamId = Guid.NewGuid();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"lp+{Guid.NewGuid():N}@example.com";
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

    private async Task SeedPartners(Guid teamId)
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Partners.AddRange(
            new Partner { TeamId = teamId, Name = "Lead Church", City = "Toronto", Stage = PartnerStage.Lead },
            new Partner { TeamId = teamId, Name = "Funnel Church", City = "Ottawa", Stage = PartnerStage.InFunnel },
            new Partner { TeamId = Guid.NewGuid(), Name = "Other Team", City = "Montreal", Stage = PartnerStage.Lead }
        );
        await db.SaveChangesAsync();
    }

    [Fact]
    public async Task ListPartners_ReturnsTeamOwnedPartners()
    {
        var (cookie, teamId) = await SignIn();
        await SeedPartners(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/partners");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var rows = await response.Content.ReadFromJsonAsync<List<Dictionary<string, object>>>();
        Assert.All(rows!, r => Assert.NotNull(r["id"]));
        Assert.True(rows!.Count >= 2);
        Assert.DoesNotContain(rows, r => r["name"].ToString() == "Other Team");
    }

    [Fact]
    public async Task ListPartners_StageFilter_ReturnsOnlyMatching()
    {
        var (cookie, teamId) = await SignIn();
        await SeedPartners(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/partners?stages=Lead");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var rows = await response.Content.ReadFromJsonAsync<List<Dictionary<string, object>>>();
        Assert.All(rows!, r => Assert.Equal("Lead", r["stage"].ToString()));
    }
}
