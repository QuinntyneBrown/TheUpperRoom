using MediatR;

namespace TheUpperRoom.Api.Logs;

public record CreateLogCommand(
    string Level,
    string Message,
    string? Stack,
    string Route,
    string Version,
    string UserAgent,
    string? CorrelationId) : IRequest;

public class CreateLogHandler(ILogger<CreateLogHandler> logger) : IRequestHandler<CreateLogCommand>
{
    private const int MaxMessageLength = 500;
    private const int MaxStackLength = 16 * 1024;

    public Task Handle(CreateLogCommand request, CancellationToken cancellationToken)
    {
        if (request.Message.Length > MaxMessageLength) return Task.CompletedTask;
        if (request.Stack is { Length: > MaxStackLength }) return Task.CompletedTask;

        logger.LogInformation(
            "Source=frontend level={Level} message={Message} route={Route} version={Version} corr={CorrelationId}",
            request.Level, request.Message, request.Route, request.Version, request.CorrelationId ?? "-");

        return Task.CompletedTask;
    }
}
