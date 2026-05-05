using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Contacts;

public record UpdateContactCommand(
    Guid Id,
    string FirstName,
    string LastName,
    string? Email,
    string? Phone,
    string? City,
    int Version) : IRequest<bool>;

public class UpdateContactCommandValidator : AbstractValidator<UpdateContactCommand>
{
    public UpdateContactCommandValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).EmailAddress().When(x => !string.IsNullOrEmpty(x.Email));
        RuleFor(x => x.Phone)
            .Matches(@"^\+?[\d\s\-().]{7,20}$")
            .When(x => !string.IsNullOrEmpty(x.Phone));
        RuleFor(x => x.City).MaximumLength(100);
    }
}

public class UpdateContactCommandHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<UpdateContactCommand, bool>
{
    public async Task<bool> Handle(UpdateContactCommand cmd, CancellationToken ct)
    {
        var contact = await db.Contacts.FirstOrDefaultAsync(c => c.Id == cmd.Id, ct);
        if (contact is null) return false;

        if (!currentUser.IsAdmin && currentUser.TeamId != contact.TeamId) return false;

        if (contact.Version != cmd.Version)
            throw new ConflictException("Contact was modified by someone else. Please refresh and try again.");

        contact.FirstName = cmd.FirstName;
        contact.LastName = cmd.LastName;
        contact.Email = cmd.Email;
        contact.Phone = cmd.Phone;
        contact.City = cmd.City;
        contact.Version++;
        contact.UpdatedAt = DateTime.UtcNow;
        contact.UpdatedById = currentUser.Id;

        await db.SaveChangesAsync(ct);
        return true;
    }
}

public class ConflictException(string message) : Exception(message);
