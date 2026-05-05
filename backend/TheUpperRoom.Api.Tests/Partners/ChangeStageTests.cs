// Traces to: 16 — Move Partner Through Funnel Stages
// L2-017: stage change persists, history row appended from/to/by/at; cross-team rejected
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Partners;

public class ChangeStageTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<(string cookie, Guid userId, Guid teamId)> SignInAsTeamMember()
    {
        var teamId = Guid.NewGuid();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"stage+{Guid.NewGuid():N}@example.com";
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

    private async Task<Guid> SeedPartner(Guid teamId, PartnerStage stage = PartnerStage.Lead)
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var partner = new Partner { TeamId = teamId, Name = "Test Church", City = "Toronto", Stage = stage };
        db.Partners.Add(partner);
        await db.SaveChangesAsync();
        return partner.Id;
    }

    [Fact]
    public async Task ChangeStage_ValidTransition_Returns200()
    {
        var (cookie, _, teamId) = await SignInAsTeamMember();
        var partnerId = await SeedPartner(teamId, PartnerStage.Lead);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, $"/api/partners/{partnerId}/stage");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { toStage = "InFunnel" });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task ChangeStage_PersistsStageAndAppendsHistory()
    {
        var (cookie, userId, teamId) = await SignInAsTeamMember();
        var partnerId = await SeedPartner(teamId, PartnerStage.Lead);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, $"/api/partners/{partnerId}/stage");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { toStage = "InFunnel" });
        await client.SendAsync(req);

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var partner = db.Partners.First(p => p.Id == partnerId);
        Assert.Equal(PartnerStage.InFunnel, partner.Stage);

        var history = db.PartnerStageHistories.Where(h => h.PartnerId == partnerId).ToList();
        Assert.Single(history);
        Assert.Equal(PartnerStage.Lead, history[0].FromStage);
        Assert.Equal(PartnerStage.InFunnel, history[0].ToStage);
        Assert.Equal(userId, history[0].ChangedById);
        Assert.True(history[0].ChangedAt > DateTime.UtcNow.AddSeconds(-10));
    }

    [Fact]
    public async Task ChangeStage_CrossTeamPartner_Returns404()
    {
        var (cookie, _, _) = await SignInAsTeamMember();
        var partnerId = await SeedPartner(Guid.NewGuid()); // different team

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, $"/api/partners/{partnerId}/stage");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { toStage = "InFunnel" });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task ChangeStage_InvalidStageValue_Returns400()
    {
        var (cookie, _, teamId) = await SignInAsTeamMember();
        var partnerId = await SeedPartner(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, $"/api/partners/{partnerId}/stage");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { toStage = "Unknown" });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
