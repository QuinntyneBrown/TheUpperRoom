using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Partners;

public record PartnerListRow(Guid Id, string Name, string City, string? Website, string Stage);

public record ListPartnersQuery(PartnerStage[]? Stages) : IRequest<List<PartnerListRow>>;

public class ListPartnersQueryHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<ListPartnersQuery, List<PartnerListRow>>
{
    public async Task<List<PartnerListRow>> Handle(ListPartnersQuery query, CancellationToken ct)
    {
        var q = db.Partners
            .Where(p => currentUser.IsAdmin || p.TeamId == currentUser.TeamId);

        if (query.Stages is { Length: > 0 })
            q = q.Where(p => query.Stages.Contains(p.Stage));

        return await q
            .OrderBy(p => p.Name)
            .Select(p => new PartnerListRow(p.Id, p.Name, p.City, p.Website, p.Stage.ToString()))
            .ToListAsync(ct);
    }
}
