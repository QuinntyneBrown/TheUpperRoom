using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Partners;

public record AddPartnerContactCommand(Guid PartnerId, Guid ContactId) : IRequest<bool>;

public class AddPartnerContactCommandHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<AddPartnerContactCommand, bool>
{
    public async Task<bool> Handle(AddPartnerContactCommand cmd, CancellationToken ct)
    {
        var partner = await db.Partners.FirstOrDefaultAsync(
            p => p.Id == cmd.PartnerId && (currentUser.IsAdmin || p.TeamId == currentUser.TeamId), ct);
        if (partner is null) return false;

        var exists = await db.PartnerContacts.AnyAsync(
            pc => pc.PartnerId == cmd.PartnerId && pc.ContactId == cmd.ContactId, ct);
        if (exists) return true;

        db.PartnerContacts.Add(new PartnerContact { PartnerId = cmd.PartnerId, ContactId = cmd.ContactId });
        await db.SaveChangesAsync(ct);
        return true;
    }
}
