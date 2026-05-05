using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Admin;

public record RestoreContactCommand(Guid Id) : IRequest<bool>;

public class RestoreContactCommandHandler(AppDbContext db)
    : IRequestHandler<RestoreContactCommand, bool>
{
    public async Task<bool> Handle(RestoreContactCommand cmd, CancellationToken ct)
    {
        var contact = await db.Contacts
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(c => c.Id == cmd.Id, ct);

        if (contact is null) return false;

        contact.DeletedAt = null;
        await db.SaveChangesAsync(ct);
        return true;
    }
}
