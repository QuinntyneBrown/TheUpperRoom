using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Hackathons;

public record DeleteHackathonCommand(Guid Id) : IRequest<bool>;

public class DeleteHackathonHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<DeleteHackathonCommand, bool>
{
    public async Task<bool> Handle(DeleteHackathonCommand cmd, CancellationToken ct)
    {
        var hackathon = await db.Hackathons
            .FirstOrDefaultAsync(h => h.Id == cmd.Id &&
                (currentUser.IsAdmin || h.TeamId == currentUser.TeamId), ct);

        if (hackathon is null) return false;

        hackathon.DeletedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        return true;
    }
}
