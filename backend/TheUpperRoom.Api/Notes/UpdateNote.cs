using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Notes;

public record UpdateNoteCommand(Guid NoteId, string Body) : IRequest<bool?>;

public class UpdateNoteCommandValidator : AbstractValidator<UpdateNoteCommand>
{
    public UpdateNoteCommandValidator()
    {
        RuleFor(x => x.Body).NotEmpty().Length(1, 4000);
    }
}

public class UpdateNoteCommandHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<UpdateNoteCommand, bool?>
{
    public async Task<bool?> Handle(UpdateNoteCommand cmd, CancellationToken ct)
    {
        var note = await db.Notes.FirstOrDefaultAsync(n => n.Id == cmd.NoteId, ct);
        if (note is null) return null;

        var isAdminOrLead = currentUser.IsAdmin ||
            (currentUser.IsAuthenticated && await IsTeamLead(note, ct));

        if (note.AuthorId != currentUser.Id && !isAdminOrLead) return false;

        note.Body = cmd.Body;
        note.UpdatedAt = DateTime.UtcNow;
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
