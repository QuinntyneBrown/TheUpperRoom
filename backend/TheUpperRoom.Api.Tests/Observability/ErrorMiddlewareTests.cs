// Traces to: 59 - Backend exception handling and error counter
// L2-044 AC2: unhandled exceptions return 500 with correlationId, log full stack, increment counter
using System.Diagnostics.Metrics;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using TheUpperRoom.Api.Observability;

namespace TheUpperRoom.Api.Tests.Observability;

public class ErrorMiddlewareTests
{
    [Fact]
    public async Task Invoke_Returns500WithBody_WhenNextThrows()
    {
        var logger = new CaptureLogger<ErrorMiddleware>();
        var metrics = new ApiMetrics();
        var context = new DefaultHttpContext();
        context.Items["CorrelationId"] = "err-test-id";
        context.Response.Body = new System.IO.MemoryStream();
        var sut = new ErrorMiddleware(_ => throw new InvalidOperationException("boom"), logger, metrics);

        await sut.InvokeAsync(context);

        Assert.Equal(500, context.Response.StatusCode);
        context.Response.Body.Seek(0, System.IO.SeekOrigin.Begin);
        var body = await JsonDocument.ParseAsync(context.Response.Body);
        Assert.Equal("internal_error", body.RootElement.GetProperty("error").GetString());
        Assert.Equal("err-test-id", body.RootElement.GetProperty("correlationId").GetString());
    }

    [Fact]
    public async Task Invoke_LogsErrorWithException_WhenNextThrows()
    {
        var logger = new CaptureLogger<ErrorMiddleware>();
        var metrics = new ApiMetrics();
        var context = new DefaultHttpContext();
        context.Items["CorrelationId"] = "log-test-id";
        context.Response.Body = new System.IO.MemoryStream();
        var sut = new ErrorMiddleware(_ => throw new InvalidOperationException("boom"), logger, metrics);

        await sut.InvokeAsync(context);

        Assert.Single(logger.Messages);
        Assert.Contains("log-test-id", logger.Messages[0]);
        Assert.NotNull(logger.Exceptions[0]);
    }

    [Fact]
    public async Task Invoke_IncrementsErrorCounter_WhenNextThrows()
    {
        var metrics = new ApiMetrics();
        long captured = 0;
        using var listener = new MeterListener();
        listener.InstrumentPublished = (instrument, l) =>
        {
            if (instrument.Meter.Name == ApiMetrics.MeterName) l.EnableMeasurementEvents(instrument);
        };
        listener.SetMeasurementEventCallback<long>((_, value, _, _) => captured += value);
        listener.Start();

        var context = new DefaultHttpContext();
        context.Response.Body = new System.IO.MemoryStream();
        var sut = new ErrorMiddleware(_ => throw new Exception("x"), new CaptureLogger<ErrorMiddleware>(), metrics);

        await sut.InvokeAsync(context);

        Assert.Equal(1, captured);
    }

    [Fact]
    public async Task Invoke_PassesThrough_WhenNoException()
    {
        var logger = new CaptureLogger<ErrorMiddleware>();
        var metrics = new ApiMetrics();
        var context = new DefaultHttpContext();
        context.Response.StatusCode = 200;
        var sut = new ErrorMiddleware(_ => Task.CompletedTask, logger, metrics);

        await sut.InvokeAsync(context);

        Assert.Equal(200, context.Response.StatusCode);
        Assert.Empty(logger.Messages);
    }
}
