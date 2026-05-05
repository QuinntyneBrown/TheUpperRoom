using FluentValidation;
using MediatR;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Contacts;

public record CreateContactCommand(
    Guid? TeamId,
    string FirstName,
    string LastName,
    string? Email,
    string? Phone,
    string? City,
    string? Notes) : IRequest<Guid>, ITeamScopedRequest
{
    public Guid TargetTeamId => TeamId ?? Guid.Empty;
}

public class CreateContactCommandValidator : AbstractValidator<CreateContactCommand>
{
    public CreateContactCommandValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).EmailAddress().When(x => !string.IsNullOrEmpty(x.Email));
        RuleFor(x => x.Phone)
            .Matches(@"^\+?[\d\s\-().]{7,20}$")
            .When(x => !string.IsNullOrEmpty(x.Phone));
        RuleFor(x => x.City).MaximumLength(100);
        RuleFor(x => x.Notes).Length(1, 4000).When(x => !string.IsNullOrWhiteSpace(x.Notes));
    }
}

public class CreateContactCommandHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<CreateContactCommand, Guid>
{
    public async Task<Guid> Handle(CreateContactCommand cmd, CancellationToken ct)
    {
        var contact = new Contact
        {
            TeamId = cmd.TeamId ?? currentUser.TeamId ?? Guid.Empty,
            FirstName = cmd.FirstName,
            LastName = cmd.LastName,
            Email = cmd.Email,
            Phone = cmd.Phone,
            City = cmd.City,
        };

        if (!string.IsNullOrWhiteSpace(cmd.Notes))
        {
            contact.Notes.Add(new Note
            {
                ContactId = contact.Id,
                AuthorId = currentUser.Id ?? Guid.Empty,
                Body = cmd.Notes,
            });
        }

        db.Contacts.Add(contact);
        await db.SaveChangesAsync(ct);
        return contact.Id;
    }
}
