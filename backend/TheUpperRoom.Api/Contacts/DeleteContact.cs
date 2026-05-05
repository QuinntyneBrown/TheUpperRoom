using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Contacts;

public record DeleteContactCommand(Guid Id) : IRequest<bool>;

public class DeleteContactCommandHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<DeleteContactCommand, bool>
{
    public async Task<bool> Handle(DeleteContactCommand cmd, CancellationToken ct)
    {
        var contact = await db.Contacts.FirstOrDefaultAsync(c => c.Id == cmd.Id, ct);
        if (contact is null) return false;

        if (!currentUser.IsAdmin && currentUser.TeamId != contact.TeamId) return false;

        contact.DeletedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        return true;
    }
}
