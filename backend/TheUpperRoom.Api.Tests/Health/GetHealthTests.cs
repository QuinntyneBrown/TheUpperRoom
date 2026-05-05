// Traces to: 01 - project skeleton
// Description: GET /api/health returns { status: "ok", version, time }
using TheUpperRoom.Api.Health;

namespace TheUpperRoom.Api.Tests.Health;

public class GetHealthTests
{
    [Fact]
    public async Task Handle_ReturnsOkStatus()
    {
        var handler = new GetHealthHandler();
        var result = await handler.Handle(new GetHealthQuery(), default);
        Assert.Equal("ok", result.Status);
    }

    [Fact]
    public async Task Handle_ReturnsVersion()
    {
        var handler = new GetHealthHandler();
        var result = await handler.Handle(new GetHealthQuery(), default);
        Assert.NotEmpty(result.Version);
    }

    [Fact]
    public async Task Handle_ReturnsCurrentTime()
    {
        var handler = new GetHealthHandler();
        var result = await handler.Handle(new GetHealthQuery(), default);
        Assert.True(result.Time > DateTime.MinValue);
    }
}
