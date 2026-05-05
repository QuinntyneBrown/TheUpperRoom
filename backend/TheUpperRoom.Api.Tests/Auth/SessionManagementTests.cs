// Traces to: 05 — Session Management
// L2-004: Identity cookie is HttpOnly, SameSite=Lax, sliding 30 min, absolute 12 h cap
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace TheUpperRoom.Api.Tests.Auth;

public class SessionManagementTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public void CookieOptions_HttpOnly_IsTrue()
    {
        var opts = factory.Services.GetRequiredService<IOptionsMonitor<CookieAuthenticationOptions>>()
            .Get(IdentityConstants.ApplicationScheme);
        Assert.True(opts.Cookie.HttpOnly);
    }

    [Fact]
    public void CookieOptions_SameSite_IsLax()
    {
        var opts = factory.Services.GetRequiredService<IOptionsMonitor<CookieAuthenticationOptions>>()
            .Get(IdentityConstants.ApplicationScheme);
        Assert.Equal(SameSiteMode.Lax, opts.Cookie.SameSite);
    }

    [Fact]
    public void CookieOptions_SlidingExpiration_IsTrue_WithThirtyMinutes()
    {
        var opts = factory.Services.GetRequiredService<IOptionsMonitor<CookieAuthenticationOptions>>()
            .Get(IdentityConstants.ApplicationScheme);
        Assert.True(opts.SlidingExpiration);
        Assert.Equal(TimeSpan.FromMinutes(30), opts.ExpireTimeSpan);
    }

    [Fact]
    public async Task SignIn_Response_ContainsHttpOnlyCookie()
    {
        // Register and verify a user first
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"session+{Guid.NewGuid():N}@example.com";
        const string password = "Str0ng!Pass#99";

        await client.PostAsJsonAsync("/api/auth/register", new { email, password, displayName = "S", city = "Dublin" });

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<TheUpperRoom.Api.Infrastructure.AppDbContext>();
        var user = db.Users.First(u => u.Email == email);
        user.EmailConfirmed = true;
        await db.SaveChangesAsync();

        var response = await client.PostAsJsonAsync("/api/auth/sign-in", new { email, password });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var setCookieHeader = response.Headers.GetValues("Set-Cookie").FirstOrDefault() ?? "";
        Assert.Contains("httponly", setCookieHeader, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("samesite=lax", setCookieHeader, StringComparison.OrdinalIgnoreCase);
    }
}
