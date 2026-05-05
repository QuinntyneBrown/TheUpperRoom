using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Hackathons;

public record HackathonListRow(Guid Id, string Title, DateOnly StartDate, DateOnly EndDate, string HostCity, string CurrentStage);
public record ListHackathonsQuery : IRequest<List<HackathonListRow>>;

public class ListHackathonsHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<ListHackathonsQuery, List<HackathonListRow>>
{
    public async Task<List<HackathonListRow>> Handle(ListHackathonsQuery _, CancellationToken ct) =>
        await db.Hackathons
            .Where(h => currentUser.IsAdmin || h.TeamId == currentUser.TeamId)
            .OrderByDescending(h => h.StartDate)
            .Select(h => new HackathonListRow(h.Id, h.Title, h.StartDate, h.EndDate, h.HostCity, h.Stage.ToString()))
            .ToListAsync(ct);
}
