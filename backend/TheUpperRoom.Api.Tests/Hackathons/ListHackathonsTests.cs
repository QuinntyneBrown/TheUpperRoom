// Traces to: 43 — Hackathon List and Navigation
// L2-025 AC: team member sees only their team's hackathons ordered by StartDate DESC
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Hackathons;

public class ListHackathonsTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<(string cookie, Guid teamId)> SignIn()
    {
        var teamId = Guid.NewGuid();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"lh+{Guid.NewGuid():N}@example.com";
        const string pw = "Str0ng!Pass#99";
        await client.PostAsJsonAsync("/api/auth/register", new { email, password = pw, displayName = "Lead", city = "Ottawa" });
        using var scope = factory.Services.CreateScope();
        var um = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var user = db.Users.First(u => u.Email == email);
        user.EmailConfirmed = true;
        user.TeamId = teamId;
        await db.SaveChangesAsync();
        await um.AddToRoleAsync(user, Roles.CityLead);
        var resp = await client.PostAsJsonAsync("/api/auth/sign-in", new { email, password = pw });
        return (resp.Headers.GetValues("Set-Cookie").First().Split(';')[0], teamId);
    }

    private async Task SeedHackathons(Guid teamId)
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Hackathons.AddRange(
            new Hackathon { TeamId = teamId, Title = "Hack A", HostCity = "Ottawa", StartDate = new DateOnly(2025, 3, 1), EndDate = new DateOnly(2025, 3, 3) },
            new Hackathon { TeamId = teamId, Title = "Hack B", HostCity = "Toronto", StartDate = new DateOnly(2025, 1, 1), EndDate = new DateOnly(2025, 1, 2) },
            new Hackathon { TeamId = Guid.NewGuid(), Title = "Other Team", HostCity = "Montreal", StartDate = new DateOnly(2025, 2, 1), EndDate = new DateOnly(2025, 2, 2) }
        );
        await db.SaveChangesAsync();
    }

    [Fact]
    public async Task List_ReturnsOnlyTeamHackathons()
    {
        var (cookie, teamId) = await SignIn();
        await SeedHackathons(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/hackathons");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var rows = await response.Content.ReadFromJsonAsync<HackathonListRowDto[]>();
        Assert.NotNull(rows);
        Assert.Equal(2, rows.Length);
        Assert.DoesNotContain(rows, r => r.Title == "Other Team");
    }

    [Fact]
    public async Task List_OrderedByStartDateDesc()
    {
        var (cookie, teamId) = await SignIn();
        await SeedHackathons(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/hackathons");
        req.Headers.Add("Cookie", cookie);
        var rows = await (await client.SendAsync(req)).Content.ReadFromJsonAsync<HackathonListRowDto[]>();

        Assert.NotNull(rows);
        Assert.True(rows.Length >= 2);
        Assert.True(rows[0].StartDate >= rows[1].StartDate);
    }

    [Fact]
    public async Task List_IncludesRequiredFields()
    {
        var (cookie, teamId) = await SignIn();
        await SeedHackathons(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/hackathons");
        req.Headers.Add("Cookie", cookie);
        var rows = await (await client.SendAsync(req)).Content.ReadFromJsonAsync<HackathonListRowDto[]>();

        Assert.NotNull(rows);
        var row = rows.First(r => r.Title == "Hack A");
        Assert.False(string.IsNullOrEmpty(row.HostCity));
        Assert.False(string.IsNullOrEmpty(row.CurrentStage));
    }
}

file record HackathonListRowDto(Guid Id, string Title, DateOnly StartDate, DateOnly EndDate, string HostCity, string CurrentStage);
