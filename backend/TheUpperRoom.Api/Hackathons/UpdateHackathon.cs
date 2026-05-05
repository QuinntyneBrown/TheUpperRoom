using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Hackathons;

public record UpdateHackathonCommand(
    Guid Id,
    string Title,
    DateOnly StartDate,
    DateOnly EndDate,
    string HostCity,
    Guid[] PartnerIds) : IRequest<bool>;

public class UpdateHackathonValidator : AbstractValidator<UpdateHackathonCommand>
{
    public UpdateHackathonValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MaximumLength(120);
        RuleFor(x => x.EndDate).GreaterThanOrEqualTo(x => x.StartDate)
            .WithMessage("endDate must be >= startDate.");
        RuleFor(x => x.HostCity).NotEmpty();
    }
}

public class UpdateHackathonHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<UpdateHackathonCommand, bool>
{
    public async Task<bool> Handle(UpdateHackathonCommand cmd, CancellationToken ct)
    {
        var hackathon = await db.Hackathons
            .FirstOrDefaultAsync(h => h.Id == cmd.Id &&
                (currentUser.IsAdmin || h.TeamId == currentUser.TeamId), ct);

        if (hackathon is null) return false;

        hackathon.Title = cmd.Title;
        hackathon.StartDate = cmd.StartDate;
        hackathon.EndDate = cmd.EndDate;
        hackathon.HostCity = cmd.HostCity;

        var existing = db.HackathonPartners.Where(hp => hp.HackathonId == cmd.Id);
        db.HackathonPartners.RemoveRange(existing);

        foreach (var pid in cmd.PartnerIds)
            db.HackathonPartners.Add(new() { HackathonId = cmd.Id, PartnerId = pid });

        await db.SaveChangesAsync(ct);
        return true;
    }
}
