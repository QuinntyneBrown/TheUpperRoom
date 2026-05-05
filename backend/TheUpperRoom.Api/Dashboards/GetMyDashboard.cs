using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Dashboards;

public record DashboardDto(string Json);
public record GetMyDashboardQuery : IRequest<DashboardDto>;

public class GetMyDashboardQueryHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<GetMyDashboardQuery, DashboardDto>
{
    public async Task<DashboardDto> Handle(GetMyDashboardQuery query, CancellationToken ct)
    {
        var layout = await db.DashboardLayouts.FindAsync([currentUser.Id!.Value], ct);
        return new DashboardDto(layout?.Json ?? """{"items":[]}""");
    }
}
