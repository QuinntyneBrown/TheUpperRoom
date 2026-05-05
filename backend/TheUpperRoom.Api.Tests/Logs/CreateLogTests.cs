// Traces to: 61 - Frontend global error logging
// L2-045 AC1: log endpoint accepts frontend errors and writes them tagged Source=frontend
using Microsoft.Extensions.Logging;
using TheUpperRoom.Api.Logs;
using TheUpperRoom.Api.Tests.Observability;

namespace TheUpperRoom.Api.Tests.Logs;

public class CreateLogTests
{
    [Fact]
    public async Task Handle_WritesLogEntry()
    {
        var logger = new CaptureLogger<CreateLogHandler>();
        var cmd = new CreateLogCommand("error", "Something broke", null, "/dashboard", "1.0.0", "Chrome", null);
        var handler = new CreateLogHandler(logger);

        await handler.Handle(cmd, default);

        Assert.Single(logger.Messages);
        Assert.Contains("frontend", logger.Messages[0]);
        Assert.Contains("Something broke", logger.Messages[0]);
    }

    [Fact]
    public async Task Handle_RejectsMessageExceeding500Chars()
    {
        var logger = new CaptureLogger<CreateLogHandler>();
        var longMessage = new string('x', 501);
        var cmd = new CreateLogCommand("error", longMessage, null, "/", "1.0.0", "UA", null);
        var handler = new CreateLogHandler(logger);

        await handler.Handle(cmd, default);

        Assert.Empty(logger.Messages);
    }

    [Fact]
    public async Task Handle_RejectsStackExceeding16KB()
    {
        var logger = new CaptureLogger<CreateLogHandler>();
        var bigStack = new string('x', 16 * 1024 + 1);
        var cmd = new CreateLogCommand("error", "msg", bigStack, "/", "1.0.0", "UA", null);
        var handler = new CreateLogHandler(logger);

        await handler.Handle(cmd, default);

        Assert.Empty(logger.Messages);
    }
}
