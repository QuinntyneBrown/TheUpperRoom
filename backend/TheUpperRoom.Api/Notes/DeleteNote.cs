using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Notes;

public record DeleteNoteCommand(Guid NoteId) : IRequest<bool?>;

public class DeleteNoteCommandHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<DeleteNoteCommand, bool?>
{
    public async Task<bool?> Handle(DeleteNoteCommand cmd, CancellationToken ct)
    {
        var note = await db.Notes.FirstOrDefaultAsync(n => n.Id == cmd.NoteId, ct);
        if (note is null) return null;

        var isAdminOrLead = currentUser.IsAdmin ||
            (currentUser.IsAuthenticated && await IsTeamLead(note, ct));

        if (note.AuthorId != currentUser.Id && !isAdminOrLead) return false;

        note.DeletedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
        return true;
    }

    private async Task<bool> IsTeamLead(Domain.Note note, CancellationToken ct)
    {
        if (note.TargetType != "Contact") return false;
        var contact = await db.Contacts.FirstOrDefaultAsync(c => c.Id == note.TargetId, ct);
        return contact?.TeamId == currentUser.TeamId && currentUser.IsInRole(Roles.CityLead);
    }
}
