// Traces to: 31 — Real-Time Metric Charts
// L2-034: metric queries return series data; invalidation events broadcast on mutation
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Metrics;

public class MetricsTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<(string cookie, Guid userId, Guid teamId)> SignInAs(string role, Guid? teamId = null)
    {
        var tid = teamId ?? Guid.NewGuid();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"met+{Guid.NewGuid():N}@example.com";
        const string password = "Str0ng!Pass#99";
        await client.PostAsJsonAsync("/api/auth/register", new { email, password, displayName = "User", city = "Toronto" });
        using var scope = factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var user = db.Users.First(u => u.Email == email);
        user.EmailConfirmed = true;
        user.TeamId = tid;
        await db.SaveChangesAsync();
        await userManager.AddToRoleAsync(user, role);
        var resp = await client.PostAsJsonAsync("/api/auth/sign-in", new { email, password });
        return (resp.Headers.GetValues("Set-Cookie").First().Split(';')[0], user.Id, tid);
    }

    [Fact]
    public async Task GetMetric_ContactsCreatedDaily_Returns200WithSeriesData()
    {
        var (cookie, _, _) = await SignInAs(Roles.CityLead);
        var from = DateTime.UtcNow.AddDays(-7).ToString("o");
        var to = DateTime.UtcNow.ToString("o");

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, $"/api/metrics/contactsCreatedDaily?from={Uri.EscapeDataString(from)}&to={Uri.EscapeDataString(to)}&bucket=day");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.NotNull(body);
        Assert.True(body!.ContainsKey("metric"));
        Assert.True(body.ContainsKey("series"));
    }

    [Fact]
    public async Task GetMetric_PartnerStageTransitionsWeekly_Returns200WithSeriesData()
    {
        var (cookie, _, _) = await SignInAs(Roles.CityLead);
        var from = DateTime.UtcNow.AddDays(-30).ToString("o");
        var to = DateTime.UtcNow.ToString("o");

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, $"/api/metrics/partnerStageTransitionsWeekly?from={Uri.EscapeDataString(from)}&to={Uri.EscapeDataString(to)}&bucket=week");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.NotNull(body);
        Assert.True(body!.ContainsKey("series"));
    }

    [Fact]
    public async Task GetMetric_HackathonStageProgress_Returns200WithSeriesData()
    {
        var (cookie, _, _) = await SignInAs(Roles.CityLead);
        var from = DateTime.UtcNow.AddDays(-90).ToString("o");
        var to = DateTime.UtcNow.ToString("o");

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, $"/api/metrics/hackathonStageProgress?from={Uri.EscapeDataString(from)}&to={Uri.EscapeDataString(to)}&bucket=week");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.NotNull(body);
        Assert.True(body!.ContainsKey("series"));
    }

    [Fact]
    public async Task GetMetric_UnknownMetric_Returns400()
    {
        var (cookie, _, _) = await SignInAs(Roles.CityLead);
        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/metrics/unknownMetric?from=2024-01-01T00:00:00Z&to=2024-01-31T00:00:00Z");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
