using MediatR;
using Microsoft.AspNetCore.Antiforgery;

namespace TheUpperRoom.Api.Csrf;

public record GetCsrfTokenQuery : IRequest;

public class GetCsrfTokenHandler(IAntiforgery antiforgery, IHttpContextAccessor httpContext)
    : IRequestHandler<GetCsrfTokenQuery>
{
    public Task Handle(GetCsrfTokenQuery request, CancellationToken cancellationToken)
    {
        antiforgery.SetCookieTokenAndHeader(httpContext.HttpContext!);
        return Task.CompletedTask;
    }
}
