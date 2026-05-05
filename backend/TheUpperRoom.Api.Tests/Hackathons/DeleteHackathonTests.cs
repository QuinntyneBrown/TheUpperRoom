// Traces to: 45 — Delete and Restore Hackathon
// L2-063: soft delete; L2-008: 403 for lower roles; admin restore brings it back
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Hackathons;

public class DeleteHackathonTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<(string cookie, Guid teamId)> SignInWithRole(string role)
    {
        var teamId = Guid.NewGuid();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"dh+{Guid.NewGuid():N}@example.com";
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
        var h = new Hackathon { TeamId = teamId, Title = "Test Hack", HostCity = "Ottawa", StartDate = new DateOnly(2025, 6, 1), EndDate = new DateOnly(2025, 6, 3) };
        db.Hackathons.Add(h);
        await db.SaveChangesAsync();
        return h.Id;
    }

    [Fact]
    public async Task Delete_CityLead_Returns204AndSoftDeletes()
    {
        var (cookie, teamId) = await SignInWithRole(Roles.CityLead);
        var id = await SeedHackathon(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Delete, $"/api/hackathons/{id}");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        Assert.Null(db.Hackathons.FirstOrDefault(h => h.Id == id));
        var deleted = db.Hackathons.IgnoreQueryFilters().First(h => h.Id == id);
        Assert.NotNull(deleted.DeletedAt);
    }

    [Fact]
    public async Task Delete_PrayerLead_Returns403()
    {
        var (cookie, teamId) = await SignInWithRole(Roles.PrayerLead);
        var id = await SeedHackathon(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Delete, $"/api/hackathons/{id}");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task ListDeleted_Admin_Returns200WithDeletedHackathons()
    {
        var (cookie, teamId) = await SignInWithRole(Roles.Admin);
        using (var scope = factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.Hackathons.Add(new Hackathon { TeamId = teamId, Title = "Deleted Hack", HostCity = "Ottawa", StartDate = new DateOnly(2025, 6, 1), EndDate = new DateOnly(2025, 6, 3), DeletedAt = DateTime.UtcNow });
            await db.SaveChangesAsync();
        }

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/admin/hackathons/deleted");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<DeletedHackathonDto[]>();
        Assert.NotNull(body);
        Assert.Contains(body, h => h.Title == "Deleted Hack");
    }

    [Fact]
    public async Task RestoreHackathon_Admin_Returns200AndRestores()
    {
        var (cookie, teamId) = await SignInWithRole(Roles.Admin);
        Guid id;
        using (var scope = factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var h = new Hackathon { TeamId = teamId, Title = "Restore Me", HostCity = "Ottawa", StartDate = new DateOnly(2025, 6, 1), EndDate = new DateOnly(2025, 6, 3), DeletedAt = DateTime.UtcNow };
            db.Hackathons.Add(h);
            await db.SaveChangesAsync();
            id = h.Id;
        }

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, $"/api/admin/hackathons/{id}/restore");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var scope2 = factory.Services.CreateScope();
        var db2 = scope2.ServiceProvider.GetRequiredService<AppDbContext>();
        var restored = db2.Hackathons.FirstOrDefault(h => h.Id == id);
        Assert.NotNull(restored);
        Assert.Null(restored.DeletedAt);
    }
}

file record DeletedHackathonDto(Guid Id, string Title, DateTime DeletedAt, Guid TeamId);
