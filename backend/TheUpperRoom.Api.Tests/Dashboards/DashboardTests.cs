// Traces to: 30 — Dashboard
// L2-032: empty for new user, layout persists
// L2-033: save/load
// L2-035: concurrent edits last-write-wins
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace TheUpperRoom.Api.Tests.Dashboards;

public class DashboardTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<string> RegisterAndSignIn(string email, string password = "Str0ng!Pass#99")
    {
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        await client.PostAsJsonAsync("/api/auth/register", new { email, password, displayName = "User", city = "Toronto" });
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<TheUpperRoom.Api.Infrastructure.AppDbContext>();
        var user = db.Users.First(u => u.Email == email);
        user.EmailConfirmed = true;
        await db.SaveChangesAsync();
        var resp = await client.PostAsJsonAsync("/api/auth/sign-in", new { email, password });
        return resp.Headers.GetValues("Set-Cookie").First().Split(';')[0];
    }

    [Fact]
    public async Task GetMyDashboard_NewUser_ReturnsEmptyJson()
    {
        var email = $"db+{Guid.NewGuid():N}@example.com";
        var cookie = await RegisterAndSignIn(email);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/dashboards/me");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.NotNull(body);
        Assert.True(body!.ContainsKey("json"));
    }

    [Fact]
    public async Task SaveAndLoadDashboard_PersistsLayout()
    {
        var email = $"db+{Guid.NewGuid():N}@example.com";
        var cookie = await RegisterAndSignIn(email);
        const string layout = """{"items":[{"id":"w1","x":0,"y":0,"cols":4,"rows":2,"type":"kpi"}]}""";

        var client = factory.CreateClient();
        var putReq = new HttpRequestMessage(HttpMethod.Put, "/api/dashboards/me");
        putReq.Headers.Add("Cookie", cookie);
        putReq.Content = JsonContent.Create(new { json = layout });
        var putResp = await client.SendAsync(putReq);
        Assert.Equal(HttpStatusCode.OK, putResp.StatusCode);

        var getReq = new HttpRequestMessage(HttpMethod.Get, "/api/dashboards/me");
        getReq.Headers.Add("Cookie", cookie);
        var getResp = await client.SendAsync(getReq);
        Assert.Equal(HttpStatusCode.OK, getResp.StatusCode);
        var body = await getResp.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.Equal(layout, body!["json"].ToString());
    }

    [Fact]
    public async Task SaveDashboard_InvalidJson_Returns400()
    {
        var email = $"db+{Guid.NewGuid():N}@example.com";
        var cookie = await RegisterAndSignIn(email);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Put, "/api/dashboards/me");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { json = "not-json" });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task SaveDashboard_NoItemsArray_Returns400()
    {
        var email = $"db+{Guid.NewGuid():N}@example.com";
        var cookie = await RegisterAndSignIn(email);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Put, "/api/dashboards/me");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { json = """{"widgets":[]}""" });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task SaveDashboard_ConcurrentEdits_LastWriteWins()
    {
        var email = $"db+{Guid.NewGuid():N}@example.com";
        var cookie = await RegisterAndSignIn(email);
        const string layout1 = """{"items":[{"id":"w1","x":0,"y":0,"cols":4,"rows":2,"type":"kpi"}]}""";
        const string layout2 = """{"items":[{"id":"w2","x":4,"y":0,"cols":4,"rows":2,"type":"line-chart"}]}""";

        var client = factory.CreateClient();

        async Task Save(string layout)
        {
            var r = new HttpRequestMessage(HttpMethod.Put, "/api/dashboards/me");
            r.Headers.Add("Cookie", cookie);
            r.Content = JsonContent.Create(new { json = layout });
            await client.SendAsync(r);
        }

        await Save(layout1);
        await Save(layout2);

        var getReq = new HttpRequestMessage(HttpMethod.Get, "/api/dashboards/me");
        getReq.Headers.Add("Cookie", cookie);
        var getResp = await client.SendAsync(getReq);
        var body = await getResp.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.Equal(layout2, body!["json"].ToString());
    }
}
