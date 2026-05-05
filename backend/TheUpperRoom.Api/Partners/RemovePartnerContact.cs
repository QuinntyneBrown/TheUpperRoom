using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Partners;

public record RemovePartnerContactCommand(Guid PartnerId, Guid ContactId) : IRequest<bool>;

public class RemovePartnerContactCommandHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<RemovePartnerContactCommand, bool>
{
    public async Task<bool> Handle(RemovePartnerContactCommand cmd, CancellationToken ct)
    {
        var partner = await db.Partners.FirstOrDefaultAsync(
            p => p.Id == cmd.PartnerId && (currentUser.IsAdmin || p.TeamId == currentUser.TeamId), ct);
        if (partner is null) return false;

        var link = await db.PartnerContacts.FirstOrDefaultAsync(
            pc => pc.PartnerId == cmd.PartnerId && pc.ContactId == cmd.ContactId, ct);
        if (link is null) return true;

        db.PartnerContacts.Remove(link);
        await db.SaveChangesAsync(ct);
        return true;
    }
}
