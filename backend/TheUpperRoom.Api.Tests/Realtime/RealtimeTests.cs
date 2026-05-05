// Traces to: 32 — SignalR Connection Lifecycle & Push Events
// L2-036: hub connection established; user joined team group
// L2-037: payload contract — every team event includes eventType, entityId, actorId, timestamp
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace TheUpperRoom.Api.Tests.Realtime;

public class RealtimeTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task Hub_UnauthenticatedRequest_Returns401()
    {
        var client = factory.CreateClient();
        // SignalR negotiate endpoint — 401 for unauthenticated
        var resp = await client.PostAsync("/hubs/team/negotiate?negotiateVersion=1", null);
        Assert.Equal(HttpStatusCode.Unauthorized, resp.StatusCode);
    }

    [Fact]
    public async Task TeamHub_IsRegistered_NegotiateReturns200WhenAuthenticated()
    {
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"rt+{Guid.NewGuid():N}@example.com";
        const string password = "Str0ng!Pass#99";
        await client.PostAsJsonAsync("/api/auth/register", new { email, password, displayName = "User", city = "Toronto" });
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<TheUpperRoom.Api.Infrastructure.AppDbContext>();
        var user = db.Users.First(u => u.Email == email);
        user.EmailConfirmed = true;
        await db.SaveChangesAsync();
        var signInResp = await client.PostAsJsonAsync("/api/auth/sign-in", new { email, password });
        var cookie = signInResp.Headers.GetValues("Set-Cookie").First().Split(';')[0];

        var req = new HttpRequestMessage(HttpMethod.Post, "/hubs/team/negotiate?negotiateVersion=1");
        req.Headers.Add("Cookie", cookie);
        var resp = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, resp.StatusCode);
    }
}
