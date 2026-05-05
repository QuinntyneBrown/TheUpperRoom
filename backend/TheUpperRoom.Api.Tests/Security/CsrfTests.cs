// Traces to: 69 - CSRF token flow
// L2-054: POST without X-CSRF-TOKEN → 400 csrf_required; cookie not HttpOnly
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace TheUpperRoom.Api.Tests.Security;

public class CsrfTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public void AntiforgeryOptions_UseCorrectHeaderAndCookieName()
    {
        var options = factory.Services.GetRequiredService<IOptions<AntiforgeryOptions>>().Value;
        Assert.Equal("X-CSRF-TOKEN", options.HeaderName);
        Assert.Equal("XSRF-TOKEN", options.Cookie.Name);
    }

    [Fact]
    public void AntiforgeryOptions_CookieSameSiteIsStrict()
    {
        var options = factory.Services.GetRequiredService<IOptions<AntiforgeryOptions>>().Value;
        Assert.Equal(Microsoft.AspNetCore.Http.SameSiteMode.Strict, options.Cookie.SameSite);
    }

    [Fact]
    public async Task GetCsrfToken_Returns204()
    {
        var client = factory.CreateClient();
        var response = await client.GetAsync("/api/csrf");
        Assert.Equal(System.Net.HttpStatusCode.NoContent, response.StatusCode);
    }
}
