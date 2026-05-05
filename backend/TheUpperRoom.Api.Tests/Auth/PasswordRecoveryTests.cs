// Traces to: 04 — Password Recovery
// L2-003: recovery sends generic 200; reset with valid token succeeds; invalid token returns 400
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;

namespace TheUpperRoom.Api.Tests.Auth;

public class PasswordRecoveryTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private static string UniqueEmail() => $"recovery+{Guid.NewGuid():N}@example.com";

    private async Task<(string email, string token)> CreateVerifiedUserAndToken()
    {
        var client = factory.CreateClient();
        var email = UniqueEmail();
        const string password = "Str0ng!Pass#99";

        await client.PostAsJsonAsync("/api/auth/register", new { email, password, displayName = "R", city = "Dublin" });

        using var scope = factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var db = scope.ServiceProvider.GetRequiredService<TheUpperRoom.Api.Infrastructure.AppDbContext>();
        var user = db.Users.First(u => u.Email == email);
        user.EmailConfirmed = true;
        await db.SaveChangesAsync();

        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        return (email, token);
    }

    [Fact]
    public async Task RequestRecovery_AnyEmail_Returns200WithGenericMessage()
    {
        var client = factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/auth/recovery", new { email = UniqueEmail() });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task RequestRecovery_UnregisteredEmail_Returns200SameMessage()
    {
        var client = factory.CreateClient();
        var registered = await client.PostAsJsonAsync("/api/auth/recovery",
            new { email = $"real+{Guid.NewGuid():N}@example.com" });
        var unregistered = await client.PostAsJsonAsync("/api/auth/recovery",
            new { email = "nobody@nowhere.invalid" });

        Assert.Equal(HttpStatusCode.OK, registered.StatusCode);
        Assert.Equal(HttpStatusCode.OK, unregistered.StatusCode);
    }

    [Fact]
    public async Task ResetPassword_InvalidToken_Returns400()
    {
        var client = factory.CreateClient();
        var (email, _) = await CreateVerifiedUserAndToken();
        var response = await client.PostAsJsonAsync("/api/auth/reset",
            new { email, token = "invalid-token", newPassword = "NewStr0ng!Pass#99" });
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task ResetPassword_ValidToken_Returns200AndCanSignIn()
    {
        var client = factory.CreateClient();
        var (email, token) = await CreateVerifiedUserAndToken();

        var resetResponse = await client.PostAsJsonAsync("/api/auth/reset",
            new { email, token, newPassword = "NewStr0ng!Pass#99" });
        Assert.Equal(HttpStatusCode.OK, resetResponse.StatusCode);

        var signInResponse = await client.PostAsJsonAsync("/api/auth/sign-in",
            new { email, password = "NewStr0ng!Pass#99" });
        Assert.Equal(HttpStatusCode.OK, signInResponse.StatusCode);
    }
}
