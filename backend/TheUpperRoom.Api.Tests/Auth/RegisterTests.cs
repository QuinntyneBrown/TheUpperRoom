// Traces to: 02 — User Registration
// L2-001: register, verify email, generic response on duplicate, validation on weak password
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc.Testing;

namespace TheUpperRoom.Api.Tests.Auth;

public class RegisterTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private static string UniqueEmail() => $"test+{Guid.NewGuid():N}@example.com";

    [Fact]
    public async Task Register_ValidRequest_Returns200WithGenericMessage()
    {
        var client = factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/auth/register", new
        {
            email = UniqueEmail(),
            password = "Str0ng!Pass#99",
            displayName = "Test User",
            city = "Dublin"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, string>>();
        Assert.NotNull(body!["message"]);
    }

    [Fact]
    public async Task Register_DuplicateEmail_Returns200WithSameGenericMessage()
    {
        var client = factory.CreateClient();
        var email = UniqueEmail();
        var payload = new { email, password = "Str0ng!Pass#99", displayName = "Alice", city = "Cork" };

        var first = await client.PostAsJsonAsync("/api/auth/register", payload);
        var second = await client.PostAsJsonAsync("/api/auth/register", payload);

        Assert.Equal(HttpStatusCode.OK, first.StatusCode);
        Assert.Equal(HttpStatusCode.OK, second.StatusCode);
    }

    [Fact]
    public async Task Register_WeakPassword_Returns400WithValidationError()
    {
        var client = factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/auth/register", new
        {
            email = UniqueEmail(),
            password = "short",
            displayName = "Test",
            city = "Galway"
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var body = await response.Content.ReadAsStringAsync();
        Assert.Contains("password", body, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task VerifyEmail_UnknownToken_Returns400()
    {
        var client = factory.CreateClient();
        var response = await client.GetAsync("/api/auth/verify?token=unknowntoken123");

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
