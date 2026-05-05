// Traces to: 18 — Partner Notes
// L2-019: add note to partner persists; cross-team rejected
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Notes;

public class PartnerNotesTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<(string cookie, Guid userId, Guid teamId)> SignIn()
    {
        var teamId = Guid.NewGuid();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"pn+{Guid.NewGuid():N}@example.com";
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

    private async Task<Guid> SeedPartner(Guid teamId)
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var partner = new Partner { TeamId = teamId, Name = "Test Church", City = "Toronto" };
        db.Partners.Add(partner);
        await db.SaveChangesAsync();
        return partner.Id;
    }

    [Fact]
    public async Task AddPartnerNote_Returns200AndPersists()
    {
        var (cookie, userId, teamId) = await SignIn();
        var partnerId = await SeedPartner(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, $"/api/partners/{partnerId}/notes");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { body = "Great meeting with the team today." });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        Assert.True(db.Notes.Any(n => n.TargetType == "Partner" && n.TargetId == partnerId && n.AuthorId == userId));
    }

    [Fact]
    public async Task AddPartnerNote_CrossTeamPartner_Returns404()
    {
        var (cookie, _, _) = await SignIn();
        var partnerId = await SeedPartner(Guid.NewGuid());

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, $"/api/partners/{partnerId}/notes");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { body = "Some note." });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
