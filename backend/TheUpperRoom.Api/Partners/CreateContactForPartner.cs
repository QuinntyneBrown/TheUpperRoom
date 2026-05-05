using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Partners;

public record CreateContactForPartnerCommand(
    Guid PartnerId,
    string FirstName,
    string LastName,
    string? Email,
    string? Phone) : IRequest<Guid?>;

public class CreateContactForPartnerCommandValidator : AbstractValidator<CreateContactForPartnerCommand>
{
    public CreateContactForPartnerCommandValidator()
    {
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).EmailAddress().When(x => !string.IsNullOrEmpty(x.Email));
        RuleFor(x => x.Phone)
            .Matches(@"^\+?[\d\s\-().]{7,20}$")
            .When(x => !string.IsNullOrEmpty(x.Phone));
    }
}

public class CreateContactForPartnerCommandHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<CreateContactForPartnerCommand, Guid?>
{
    public async Task<Guid?> Handle(CreateContactForPartnerCommand cmd, CancellationToken ct)
    {
        var partner = await db.Partners.FirstOrDefaultAsync(
            p => p.Id == cmd.PartnerId && (currentUser.IsAdmin || p.TeamId == currentUser.TeamId), ct);
        if (partner is null) return null;

        var contact = new Contact
        {
            TeamId = partner.TeamId,
            FirstName = cmd.FirstName,
            LastName = cmd.LastName,
            Email = cmd.Email,
            Phone = cmd.Phone,
        };
        db.Contacts.Add(contact);
        db.PartnerContacts.Add(new PartnerContact { PartnerId = partner.Id, ContactId = contact.Id });
        await db.SaveChangesAsync(ct);
        return contact.Id;
    }
}
