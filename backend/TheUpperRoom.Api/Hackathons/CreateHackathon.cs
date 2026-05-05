using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Hackathons;

public record CreateHackathonCommand(
    string Title,
    DateOnly StartDate,
    DateOnly EndDate,
    string HostCity,
    Guid[] PartnerIds) : IRequest<Guid?>;

public class CreateHackathonCommandValidator : AbstractValidator<CreateHackathonCommand>
{
    public CreateHackathonCommandValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(200);
        RuleFor(x => x.HostCity).NotEmpty().MaximumLength(100);
        RuleFor(x => x.EndDate)
            .GreaterThanOrEqualTo(x => x.StartDate)
            .WithMessage("EndDate must be on or after StartDate.");
    }
}

public class CreateHackathonCommandHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<CreateHackathonCommand, Guid?>
{
    public async Task<Guid?> Handle(CreateHackathonCommand cmd, CancellationToken ct)
    {
        var teamId = currentUser.TeamId ?? Guid.Empty;

        if (cmd.PartnerIds.Length > 0)
        {
            var validPartnerIds = await db.Partners
                .Where(p => cmd.PartnerIds.Contains(p.Id) && (currentUser.IsAdmin || p.TeamId == teamId))
                .Select(p => p.Id)
                .ToListAsync(ct);

            if (validPartnerIds.Count != cmd.PartnerIds.Length)
                return null;
        }

        var hackathon = new Hackathon
        {
            TeamId = teamId,
            Title = cmd.Title,
            StartDate = cmd.StartDate,
            EndDate = cmd.EndDate,
            HostCity = cmd.HostCity,
        };
        db.Hackathons.Add(hackathon);

        foreach (var pid in cmd.PartnerIds)
            db.HackathonPartners.Add(new HackathonPartner { HackathonId = hackathon.Id, PartnerId = pid });

        await db.SaveChangesAsync(ct);
        return hackathon.Id;
    }
}
