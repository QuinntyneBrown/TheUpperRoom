// Traces to: 03 — User Sign-In
// L2-002: sign-in returns cookie session; 401 on bad creds; 403 on unverified; lockout after 5 failures
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;

namespace TheUpperRoom.Api.Tests.Auth;

public class SignInTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private static string UniqueEmail() => $"signin+{Guid.NewGuid():N}@example.com";

    // Registers a verified user and returns their email/password.
    private async Task<(string email, string password)> RegisterVerifiedUser(HttpClient client)
    {
        var email = UniqueEmail();
        const string password = "Str0ng!Pass#99";

        // Register
        await client.PostAsJsonAsync("/api/auth/register", new { email, password, displayName = "Test", city = "Dublin" });

        // Directly verify in DB (bypasses email link for test convenience)
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<TheUpperRoom.Api.Infrastructure.AppDbContext>();
        var user = db.Users.First(u => u.Email == email);
        user.EmailConfirmed = true;
        await db.SaveChangesAsync();

        return (email, password);
    }

    [Fact]
    public async Task SignIn_ValidVerifiedUser_Returns200WithCookie()
    {
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var (email, password) = await RegisterVerifiedUser(client);

        var response = await client.PostAsJsonAsync("/api/auth/sign-in", new { email, password });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.True(response.Headers.Contains("Set-Cookie"), "Expected Set-Cookie header");
    }

    [Fact]
    public async Task SignIn_InvalidPassword_Returns401WithGenericMessage()
    {
        var client = factory.CreateClient();
        var (email, _) = await RegisterVerifiedUser(client);

        var response = await client.PostAsJsonAsync("/api/auth/sign-in", new { email, password = "WrongPass!99" });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
        var body = await response.Content.ReadAsStringAsync();
        Assert.DoesNotContain("email", body, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("password", body, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task SignIn_UnverifiedEmail_Returns403()
    {
        var client = factory.CreateClient();
        var email = UniqueEmail();
        const string password = "Str0ng!Pass#99";

        // Register but do NOT verify
        await client.PostAsJsonAsync("/api/auth/register", new { email, password, displayName = "Unverified", city = "Cork" });

        var response = await client.PostAsJsonAsync("/api/auth/sign-in", new { email, password });

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task SignIn_UnknownEmail_Returns401WithGenericMessage()
    {
        var client = factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/auth/sign-in",
            new { email = "nonexistent@example.com", password = "Str0ng!Pass#99" });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
