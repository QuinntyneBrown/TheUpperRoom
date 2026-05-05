// Traces to: 44 — Update Hackathon Details
// L2-063: Admin/CityLead updates; PrayerLead gets 403; EndDate < StartDate gets 400
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Hackathons;

public class UpdateHackathonTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<(string cookie, Guid teamId)> SignInWithRole(string role)
    {
        var teamId = Guid.NewGuid();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"uh+{Guid.NewGuid():N}@example.com";
        const string pw = "Str0ng!Pass#99";
        await client.PostAsJsonAsync("/api/auth/register", new { email, password = pw, displayName = "User", city = "City" });
        using var scope = factory.Services.CreateScope();
        var um = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var user = db.Users.First(u => u.Email == email);
        user.EmailConfirmed = true;
        user.TeamId = teamId;
        await db.SaveChangesAsync();
        await um.AddToRoleAsync(user, role);
        var resp = await client.PostAsJsonAsync("/api/auth/sign-in", new { email, password = pw });
        return (resp.Headers.GetValues("Set-Cookie").First().Split(';')[0], teamId);
    }

    private async Task<Guid> SeedHackathon(Guid teamId)
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var h = new Hackathon
        {
            TeamId = teamId,
            Title = "Original Title",
            HostCity = "Ottawa",
            StartDate = new DateOnly(2025, 6, 1),
            EndDate = new DateOnly(2025, 6, 3),
        };
        db.Hackathons.Add(h);
        await db.SaveChangesAsync();
        return h.Id;
    }

    [Fact]
    public async Task Update_CityLead_Returns200AndPersistsChanges()
    {
        var (cookie, teamId) = await SignInWithRole(Roles.CityLead);
        var id = await SeedHackathon(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Put, $"/api/hackathons/{id}");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new
        {
            title = "Updated Title",
            startDate = "2025-07-01",
            endDate = "2025-07-03",
            hostCity = "Toronto",
            partnerIds = Array.Empty<Guid>(),
        });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var updated = await db.Hackathons.IgnoreQueryFilters().FirstAsync(h => h.Id == id);
        Assert.Equal("Updated Title", updated.Title);
        Assert.Equal("Toronto", updated.HostCity);
    }

    [Fact]
    public async Task Update_PrayerLead_Returns403()
    {
        var (cookie, teamId) = await SignInWithRole(Roles.PrayerLead);
        var id = await SeedHackathon(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Put, $"/api/hackathons/{id}");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { title = "X", startDate = "2025-07-01", endDate = "2025-07-03", hostCity = "X", partnerIds = Array.Empty<Guid>() });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Update_EndDateBeforeStartDate_Returns400()
    {
        var (cookie, teamId) = await SignInWithRole(Roles.CityLead);
        var id = await SeedHackathon(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Put, $"/api/hackathons/{id}");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { title = "X", startDate = "2025-07-03", endDate = "2025-07-01", hostCity = "X", partnerIds = Array.Empty<Guid>() });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
