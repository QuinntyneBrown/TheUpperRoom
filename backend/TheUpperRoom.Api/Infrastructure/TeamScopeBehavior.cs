using MediatR;

namespace TheUpperRoom.Api.Infrastructure;

public interface ITeamScopedRequest
{
    Guid TargetTeamId { get; }
}

public class TeamScopeBehavior<TRequest, TResponse>(ICurrentUser currentUser)
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        if (request is ITeamScopedRequest scoped && currentUser.IsAuthenticated && !currentUser.IsAdmin)
        {
            if (currentUser.TeamId != scoped.TargetTeamId)
                throw new UnauthorizedAccessException("Cross-team access denied.");
        }
        return await next();
    }
}
