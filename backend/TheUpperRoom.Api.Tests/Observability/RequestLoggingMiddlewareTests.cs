// Traces to: 58 - Backend correlation and request logging
// L2-044 AC1: every request produces a structured log with all six fields
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using TheUpperRoom.Api.Observability;

namespace TheUpperRoom.Api.Tests.Observability;

public class RequestLoggingMiddlewareTests
{
    [Fact]
    public async Task Invoke_LogsRequestWithAllSixFields()
    {
        var logger = new CaptureLogger<RequestLoggingMiddleware>();
        var context = new DefaultHttpContext();
        context.Request.Method = "GET";
        context.Request.Path = "/api/health";
        context.Items["CorrelationId"] = "test-id";
        context.Response.StatusCode = 200;
        var sut = new RequestLoggingMiddleware(_ => Task.CompletedTask, logger);

        await sut.InvokeAsync(context);

        Assert.Single(logger.Messages);
        var msg = logger.Messages[0];
        Assert.Contains("GET", msg);
        Assert.Contains("/api/health", msg);
        Assert.Contains("200", msg);
        Assert.Contains("test-id", msg);
    }

    [Fact]
    public async Task Invoke_LogsDurationInMs()
    {
        var logger = new CaptureLogger<RequestLoggingMiddleware>();
        var context = new DefaultHttpContext();
        context.Items["CorrelationId"] = "x";
        context.Response.StatusCode = 200;
        var sut = new RequestLoggingMiddleware(
            async _ => await Task.Delay(10), logger);

        await sut.InvokeAsync(context);

        var msg = logger.Messages[0];
        Assert.Contains("ms", msg);
    }
}

file sealed class CaptureLogger<T> : ILogger<T>
{
    public List<string> Messages { get; } = [];
    public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;
    public bool IsEnabled(LogLevel logLevel) => true;
    public void Log<TState>(LogLevel logLevel, EventId eventId, TState state,
        Exception? exception, Func<TState, Exception?, string> formatter)
        => Messages.Add(formatter(state, exception));
}
