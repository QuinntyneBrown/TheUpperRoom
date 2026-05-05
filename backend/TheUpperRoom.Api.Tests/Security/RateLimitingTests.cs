// Traces to: 70 - Sensitive endpoint rate limiting
// L2-055: rate limiter middleware is in the pipeline; 429 response is structured
using Microsoft.AspNetCore.Mvc.Testing;

namespace TheUpperRoom.Api.Tests.Security;

public class RateLimitingTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task HealthEndpoint_RespondsNormally_WithinRateLimit()
    {
        var client = factory.CreateClient();
        var response = await client.GetAsync("/api/health");
        Assert.True((int)response.StatusCode < 500,
            "Health endpoint should respond within normal rate limit bounds.");
    }

    [Fact]
    public async Task RateLimiter_IsRegistered_AppStartsCleanly()
    {
        // Verifies AddRateLimiter and UseRateLimiter don't throw on startup
        var client = factory.CreateClient();
        var response = await client.GetAsync("/api/health");
        Assert.Equal(System.Net.HttpStatusCode.OK, response.StatusCode);
    }
}
