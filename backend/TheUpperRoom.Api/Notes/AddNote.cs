using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Contacts;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Notes;

public record AddNoteCommand(string TargetType, Guid TargetId, string Body) : IRequest<NoteDto?>;

public class AddNoteCommandValidator : AbstractValidator<AddNoteCommand>
{
    public AddNoteCommandValidator()
    {
        RuleFor(x => x.Body).NotEmpty().Length(1, 4000);
    }
}

public class AddNoteCommandHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<AddNoteCommand, NoteDto?>
{
    public async Task<NoteDto?> Handle(AddNoteCommand cmd, CancellationToken ct)
    {
        // Verify target contact belongs to user's team
        if (cmd.TargetType == "Contact")
        {
            var contact = await db.Contacts.FirstOrDefaultAsync(c => c.Id == cmd.TargetId, ct);
            if (contact is null) return null;
            if (!currentUser.IsAdmin && currentUser.TeamId != contact.TeamId) return null;
        }

        var note = new Note
        {
            TargetType = cmd.TargetType,
            TargetId = cmd.TargetId,
            AuthorId = currentUser.Id ?? Guid.Empty,
            Body = cmd.Body,
        };

        db.Notes.Add(note);
        await db.SaveChangesAsync(ct);

        return new NoteDto(note.Id, note.Body, note.AuthorId, note.CreatedAt);
    }
}
