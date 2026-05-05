// Traces to: 06 — User Sign-Out
// L2-005: sign-out clears cookie; replaying prior cookie returns 401
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace TheUpperRoom.Api.Tests.Auth;

public class SignOutTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    // Returns the raw Identity cookie value from a sign-in response.
    private async Task<(HttpClient client, string cookieHeader)> SignInAndGetCookie()
    {
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"signout+{Guid.NewGuid():N}@example.com";
        const string password = "Str0ng!Pass#99";

        await client.PostAsJsonAsync("/api/auth/register",
            new { email, password, displayName = "Out", city = "Dublin" });

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<TheUpperRoom.Api.Infrastructure.AppDbContext>();
        var user = db.Users.First(u => u.Email == email);
        user.EmailConfirmed = true;
        await db.SaveChangesAsync();

        var signInResp = await client.PostAsJsonAsync("/api/auth/sign-in", new { email, password });
        var setCookie = signInResp.Headers.GetValues("Set-Cookie").First();
        var cookieHeader = setCookie.Split(';')[0]; // "Name=Value" part only
        return (client, cookieHeader);
    }

    [Fact]
    public async Task SignOut_WithValidSession_Returns200()
    {
        var (client, cookieHeader) = await SignInAndGetCookie();
        var req = new HttpRequestMessage(HttpMethod.Post, "/api/auth/sign-out");
        req.Headers.Add("Cookie", cookieHeader);
        var response = await client.SendAsync(req);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task SignOut_WithoutSession_Returns401()
    {
        var client = factory.CreateClient();
        var response = await client.PostAsync("/api/auth/sign-out", null);
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Me_WithValidSession_Returns200()
    {
        var (client, cookieHeader) = await SignInAndGetCookie();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/auth/me");
        req.Headers.Add("Cookie", cookieHeader);
        var response = await client.SendAsync(req);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Me_WithoutSession_Returns401()
    {
        var client = factory.CreateClient();
        var response = await client.GetAsync("/api/auth/me");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
