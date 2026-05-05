namespace TheUpperRoom.Api.Observability;

public class ErrorMiddleware(RequestDelegate next, ILogger<ErrorMiddleware> logger, ApiMetrics metrics)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            var correlationId = context.Items["CorrelationId"]?.ToString() ?? "-";
            logger.LogError(ex, "Unhandled exception [{CorrelationId}]", correlationId);
            metrics.ErrorCount.Add(1, new KeyValuePair<string, object?>("path", context.Request.Path.Value));

            context.Response.StatusCode = 500;
            await context.Response.WriteAsJsonAsync(new { error = "internal_error", correlationId });
        }
    }
}
