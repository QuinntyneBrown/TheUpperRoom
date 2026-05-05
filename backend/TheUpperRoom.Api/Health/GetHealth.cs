using MediatR;

namespace TheUpperRoom.Api.Health;

public record GetHealthQuery : IRequest<GetHealthResult>;

public record GetHealthResult(string Status, string Version, DateTime Time);

public class GetHealthHandler : IRequestHandler<GetHealthQuery, GetHealthResult>
{
    public Task<GetHealthResult> Handle(GetHealthQuery request, CancellationToken cancellationToken)
        => Task.FromResult(new GetHealthResult(string.Empty, string.Empty, DateTime.MinValue));
}
