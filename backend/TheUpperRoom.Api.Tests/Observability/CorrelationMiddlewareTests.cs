// Traces to: 58 - Backend correlation and request logging
// L2-044 AC1: every request gets a correlation ID; header is echoed on response
using Microsoft.AspNetCore.Http;
using TheUpperRoom.Api.Observability;

namespace TheUpperRoom.Api.Tests.Observability;

public class CorrelationMiddlewareTests
{
    [Fact]
    public async Task Invoke_GeneratesCorrelationId_WhenHeaderAbsent()
    {
        var context = new DefaultHttpContext();
        var sut = new CorrelationMiddleware(_ => Task.CompletedTask);

        await sut.InvokeAsync(context);

        var id = context.Items["CorrelationId"]?.ToString();
        Assert.False(string.IsNullOrEmpty(id));
        Assert.True(Guid.TryParse(id, out _));
    }

    [Fact]
    public async Task Invoke_ReusesSuppliedCorrelationId()
    {
        var supplied = Guid.NewGuid().ToString();
        var context = new DefaultHttpContext();
        context.Request.Headers["X-Correlation-Id"] = supplied;
        var sut = new CorrelationMiddleware(_ => Task.CompletedTask);

        await sut.InvokeAsync(context);

        Assert.Equal(supplied, context.Items["CorrelationId"]?.ToString());
        Assert.Equal(supplied, context.Response.Headers["X-Correlation-Id"].ToString());
    }

    [Fact]
    public async Task Invoke_WritesSameIdToResponseHeader()
    {
        var context = new DefaultHttpContext();
        var sut = new CorrelationMiddleware(_ => Task.CompletedTask);

        await sut.InvokeAsync(context);

        var itemId = context.Items["CorrelationId"]?.ToString();
        var headerValue = context.Response.Headers["X-Correlation-Id"].ToString();
        Assert.Equal(itemId, headerValue);
    }

    [Fact]
    public async Task Invoke_TwoConcurrentRequests_HaveDistinctIds()
    {
        var ctx1 = new DefaultHttpContext();
        var ctx2 = new DefaultHttpContext();
        var sut = new CorrelationMiddleware(_ => Task.CompletedTask);

        await Task.WhenAll(sut.InvokeAsync(ctx1), sut.InvokeAsync(ctx2));

        var id1 = ctx1.Items["CorrelationId"]?.ToString();
        var id2 = ctx2.Items["CorrelationId"]?.ToString();
        Assert.NotEqual(id1, id2);
    }
}
