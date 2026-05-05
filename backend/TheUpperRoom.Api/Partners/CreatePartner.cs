using FluentValidation;
using MediatR;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Partners;

public record CreatePartnerCommand(
    string Name,
    string City,
    string? Website,
    PartnerStage? Stage,
    string? Description) : IRequest<Guid>;

public class CreatePartnerCommandValidator : AbstractValidator<CreatePartnerCommand>
{
    public CreatePartnerCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.City).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Website).Must(w => w is null || (
            Uri.TryCreate(w, UriKind.Absolute, out var uri) &&
            (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps)))
            .WithMessage("Website must be a valid http/https URL.");
    }
}

public class CreatePartnerCommandHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<CreatePartnerCommand, Guid>
{
    public async Task<Guid> Handle(CreatePartnerCommand cmd, CancellationToken ct)
    {
        var partner = new Partner
        {
            TeamId = currentUser.TeamId ?? Guid.Empty,
            Name = cmd.Name,
            City = cmd.City,
            Website = cmd.Website,
            Stage = cmd.Stage ?? PartnerStage.Lead,
            Description = cmd.Description,
        };
        db.Partners.Add(partner);
        await db.SaveChangesAsync(ct);
        return partner.Id;
    }
}
