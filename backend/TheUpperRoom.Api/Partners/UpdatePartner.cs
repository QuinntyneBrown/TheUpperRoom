using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Contacts;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Partners;

public record UpdatePartnerCommand(
    Guid Id,
    string Name,
    string City,
    string? Website,
    string? Description,
    int Version) : IRequest<bool>;

public class UpdatePartnerCommandValidator : AbstractValidator<UpdatePartnerCommand>
{
    public UpdatePartnerCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(200);
        RuleFor(x => x.City).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Website).MaximumLength(500).When(x => x.Website != null);
    }
}

public class UpdatePartnerCommandHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<UpdatePartnerCommand, bool>
{
    public async Task<bool> Handle(UpdatePartnerCommand cmd, CancellationToken ct)
    {
        var partner = await db.Partners.FirstOrDefaultAsync(
            p => p.Id == cmd.Id && (currentUser.IsAdmin || p.TeamId == currentUser.TeamId), ct);
        if (partner is null) return false;

        if (partner.Version != cmd.Version)
            throw new ConflictException("Partner was modified by someone else. Please refresh and try again.");

        partner.Name = cmd.Name;
        partner.City = cmd.City;
        partner.Website = cmd.Website;
        partner.Description = cmd.Description;
        partner.Version++;
        partner.UpdatedAt = DateTime.UtcNow;
        partner.UpdatedById = currentUser.Id;

        await db.SaveChangesAsync(ct);
        return true;
    }
}
