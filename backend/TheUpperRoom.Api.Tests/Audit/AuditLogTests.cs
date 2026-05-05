// Traces to: 60 - Audit logging for sensitive domain events
// L2-044 AC3: every audit Write emits one log with Category=Audit and all six fields
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using TheUpperRoom.Api.Audit;
using TheUpperRoom.Api.Tests.Observability;

namespace TheUpperRoom.Api.Tests.Audit;

public class AuditLogTests
{
    private static DefaultHttpContext BuildContext(string correlationId = "corr-1",
        string? actorId = "actor-1", string? teamId = "team-1")
    {
        var ctx = new DefaultHttpContext();
        ctx.Items["CorrelationId"] = correlationId;
        if (actorId is not null)
        {
            var claims = new[] { new System.Security.Claims.Claim("sub", actorId) };
            if (teamId is not null) claims = [.. claims, new System.Security.Claims.Claim("team", teamId)];
            ctx.User = new System.Security.Claims.ClaimsPrincipal(
                new System.Security.Claims.ClaimsIdentity(claims, "test"));
        }
        return ctx;
    }

    [Fact]
    public async Task Write_EmitsOneLogEntry()
    {
        var logger = new CaptureLogger<AuditLog>();
        var ctx = BuildContext();
        var accessor = new HttpContextAccessorStub(ctx);
        var sut = new AuditLog(logger, accessor);

        await sut.Write("userSignedIn", Guid.NewGuid(), new { });

        Assert.Single(logger.Messages);
    }

    [Fact]
    public async Task Write_TagsEntryWithAuditCategory()
    {
        var logger = new CaptureLogger<AuditLog>();
        var sut = new AuditLog(logger, new HttpContextAccessorStub(BuildContext()));

        await sut.Write("userSignedOut", null, new { });

        Assert.Contains("Audit", logger.Messages[0]);
    }

    [Fact]
    public async Task Write_IncludesAllSixIdentityFields()
    {
        var targetId = Guid.NewGuid();
        var logger = new CaptureLogger<AuditLog>();
        var sut = new AuditLog(logger, new HttpContextAccessorStub(BuildContext()));

        await sut.Write("roleAssigned", targetId, new { role = "admin" });

        var msg = logger.Messages[0];
        Assert.Contains("Audit", msg);
        Assert.Contains("roleAssigned", msg);
        Assert.Contains("actor-1", msg);
        Assert.Contains("team-1", msg);
        Assert.Contains(targetId.ToString(), msg);
        Assert.Contains("corr-1", msg);
    }
}

file sealed class HttpContextAccessorStub(HttpContext context) : IHttpContextAccessor
{
    public HttpContext? HttpContext { get => context; set { } }
}
