using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Hackathons;

public record HackathonStageHistoryDto(Guid Id, string FromStage, string ToStage, Guid ChangedById, DateTime ChangedAt);

public record HackathonDetailDto(
    Guid Id,
    Guid TeamId,
    string Title,
    DateOnly StartDate,
    DateOnly EndDate,
    string HostCity,
    string Stage,
    int Version,
    List<HackathonStageHistoryDto> History);

public record GetHackathonQuery(Guid Id) : IRequest<HackathonDetailDto?>;

public class GetHackathonQueryHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<GetHackathonQuery, HackathonDetailDto?>
{
    public async Task<HackathonDetailDto?> Handle(GetHackathonQuery query, CancellationToken ct)
    {
        var h = await db.Hackathons.FirstOrDefaultAsync(
            x => x.Id == query.Id && (currentUser.IsAdmin || x.TeamId == currentUser.TeamId), ct);
        if (h is null) return null;

        var history = await db.HackathonStageHistories
            .Where(s => s.HackathonId == h.Id)
            .OrderByDescending(s => s.ChangedAt)
            .Select(s => new HackathonStageHistoryDto(s.Id, s.FromStage.ToString(), s.ToStage.ToString(), s.ChangedById, s.ChangedAt))
            .ToListAsync(ct);

        return new HackathonDetailDto(h.Id, h.TeamId, h.Title, h.StartDate, h.EndDate, h.HostCity,
            h.Stage.ToString(), h.Version, history);
    }
}
