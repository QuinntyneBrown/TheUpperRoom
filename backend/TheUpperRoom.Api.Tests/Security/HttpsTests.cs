// Traces to: 65 - Production HTTPS and TLS enforcement
// L2-049: HSTS configured with 1-year max-age and includeSubDomains; redirect active
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace TheUpperRoom.Api.Tests.Security;

public class HttpsTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public void HstsOptions_MaxAge_IsOneYear()
    {
        var options = factory.Services.GetRequiredService<IOptions<HstsOptions>>().Value;
        Assert.Equal(TimeSpan.FromDays(365), options.MaxAge);
    }

    [Fact]
    public void HstsOptions_IncludesSubDomains()
    {
        var options = factory.Services.GetRequiredService<IOptions<HstsOptions>>().Value;
        Assert.True(options.IncludeSubDomains);
    }
}
