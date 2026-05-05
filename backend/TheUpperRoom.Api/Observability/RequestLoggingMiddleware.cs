using System.Diagnostics;

namespace TheUpperRoom.Api.Observability;

public class RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        var sw = Stopwatch.StartNew();
        await next(context);
        sw.Stop();

        var correlationId = context.Items["CorrelationId"]?.ToString() ?? "-";
        var userId = context.User.Identity?.Name ?? "anonymous";

        logger.LogInformation(
            "{Method} {Path} => {Status} {DurationMs}ms [{CorrelationId}] user={UserId}",
            context.Request.Method,
            context.Request.Path,
            context.Response.StatusCode,
            sw.ElapsedMilliseconds,
            correlationId,
            userId);
    }
}
