using MediatR;
using System.Reflection;

namespace TheUpperRoom.Api.Health;

public record GetHealthQuery : IRequest<GetHealthResult>;

public record GetHealthResult(string Status, string Version, DateTime Time);

public class GetHealthHandler : IRequestHandler<GetHealthQuery, GetHealthResult>
{
    public Task<GetHealthResult> Handle(GetHealthQuery request, CancellationToken cancellationToken)
    {
        var version = Assembly.GetExecutingAssembly().GetName().Version?.ToString() ?? "1.0.0";
        return Task.FromResult(new GetHealthResult("ok", version, DateTime.UtcNow));
    }
}
