using System.Security.Claims;

namespace TheUpperRoom.Api.Audit;

public class AuditLog(ILogger<AuditLog> logger, IHttpContextAccessor httpContext) : IAuditLog
{
    public Task Write(string eventType, Guid? targetId, object data)
    {
        var ctx = httpContext.HttpContext;
        var correlationId = ctx?.Items["CorrelationId"]?.ToString() ?? "-";
        var actorId = ctx?.User?.FindFirst("sub")?.Value ?? "-";
        var teamId = ctx?.User?.FindFirst("team")?.Value ?? "-";

        logger.LogInformation(
            "{Category} {EventType} actor={ActorId} team={TeamId} target={TargetId} corr={CorrelationId} {@Data}",
            "Audit", eventType, actorId, teamId, targetId, correlationId, data);

        return Task.CompletedTask;
    }
}
