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
    private async Task<(HttpClient client, string email, string password)> SignInUser()
    {
        var handler = new HttpClientHandler { UseCookies = true };
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false,
        });
        var email = $"signout+{Guid.NewGuid():N}@example.com";
        const string password = "Str0ng!Pass#99";

        await client.PostAsJsonAsync("/api/auth/register",
            new { email, password, displayName = "Out", city = "Dublin" });

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<TheUpperRoom.Api.Infrastructure.AppDbContext>();
        var user = db.Users.First(u => u.Email == email);
        user.EmailConfirmed = true;
        await db.SaveChangesAsync();

        await client.PostAsJsonAsync("/api/auth/sign-in", new { email, password });
        return (client, email, password);
    }

    [Fact]
    public async Task SignOut_Returns200()
    {
        var (client, _, _) = await SignInUser();
        var response = await client.PostAsync("/api/auth/sign-out", null);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task SignOut_ClearsCookie_SubsequentAuthenticatedRequestReturns401()
    {
        var (client, _, _) = await SignInUser();
        await client.PostAsync("/api/auth/sign-out", null);

        // Any authenticated endpoint should now return 401
        var response = await client.GetAsync("/api/auth/me");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
