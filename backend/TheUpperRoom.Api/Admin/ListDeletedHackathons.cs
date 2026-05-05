using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Admin;

public record DeletedHackathonDto(Guid Id, string Title, DateTime DeletedAt, Guid TeamId);
public record ListDeletedHackathonsQuery : IRequest<List<DeletedHackathonDto>>;

public class ListDeletedHackathonsHandler(AppDbContext db)
    : IRequestHandler<ListDeletedHackathonsQuery, List<DeletedHackathonDto>>
{
    public async Task<List<DeletedHackathonDto>> Handle(ListDeletedHackathonsQuery _, CancellationToken ct) =>
        await db.Hackathons
            .IgnoreQueryFilters()
            .Where(h => h.DeletedAt != null)
            .OrderByDescending(h => h.DeletedAt)
            .Select(h => new DeletedHackathonDto(h.Id, h.Title, h.DeletedAt!.Value, h.TeamId))
            .ToListAsync(ct);
}
