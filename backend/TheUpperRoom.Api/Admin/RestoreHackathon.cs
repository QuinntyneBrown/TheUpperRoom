using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Admin;

public record RestoreHackathonCommand(Guid Id) : IRequest<bool>;

public class RestoreHackathonHandler(AppDbContext db)
    : IRequestHandler<RestoreHackathonCommand, bool>
{
    public async Task<bool> Handle(RestoreHackathonCommand cmd, CancellationToken ct)
    {
        var hackathon = await db.Hackathons
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(h => h.Id == cmd.Id, ct);

        if (hackathon is null) return false;

        hackathon.DeletedAt = null;
        await db.SaveChangesAsync(ct);
        return true;
    }
}
