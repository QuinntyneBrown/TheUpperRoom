using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Partners;

public record DeletePartnerCommand(Guid Id) : IRequest<bool>;

public class DeletePartnerCommandHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<DeletePartnerCommand, bool>
{
    public async Task<bool> Handle(DeletePartnerCommand cmd, CancellationToken ct)
    {
        var partner = await db.Partners.FirstOrDefaultAsync(
            p => p.Id == cmd.Id && (currentUser.IsAdmin || p.TeamId == currentUser.TeamId), ct);
        if (partner is null) return false;

        await db.PartnerContacts.Where(pc => pc.PartnerId == cmd.Id).ExecuteDeleteAsync(ct);
        partner.DeletedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        return true;
    }
}
