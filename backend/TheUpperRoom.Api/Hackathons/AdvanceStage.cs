using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;
using TheUpperRoom.Api.Realtime;

namespace TheUpperRoom.Api.Hackathons;

public record AdvanceHackathonStageCommand(Guid HackathonId, HackathonStage ToStage) : IRequest<bool>;

public class AdvanceHackathonStageCommandValidator : AbstractValidator<AdvanceHackathonStageCommand>
{
    public AdvanceHackathonStageCommandValidator()
    {
        RuleFor(x => x.ToStage).IsInEnum();
    }
}

public class AdvanceHackathonStageCommandHandler(
    AppDbContext db,
    ICurrentUser currentUser,
    IHubContext<TeamHub> hub)
    : IRequestHandler<AdvanceHackathonStageCommand, bool>
{
    public async Task<bool> Handle(AdvanceHackathonStageCommand cmd, CancellationToken ct)
    {
        var hackathon = await db.Hackathons.FirstOrDefaultAsync(
            h => h.Id == cmd.HackathonId && (currentUser.IsAdmin || h.TeamId == currentUser.TeamId), ct);
        if (hackathon is null) return false;

        var fromStage = hackathon.Stage;
        hackathon.Stage = cmd.ToStage;

        db.HackathonStageHistories.Add(new HackathonStageHistory
        {
            HackathonId = hackathon.Id,
            FromStage = fromStage,
            ToStage = cmd.ToStage,
            ChangedById = currentUser.Id ?? Guid.Empty,
        });

        await db.SaveChangesAsync(ct);

        await hub.Clients.Group($"team:{hackathon.TeamId}").SendAsync("hackathonStageChanged", new
        {
            eventType = "hackathonStageChanged",
            entityId = hackathon.Id,
            actorId = currentUser.Id,
            timestamp = DateTime.UtcNow,
            hackathonId = hackathon.Id,
            fromStage = fromStage.ToString(),
            toStage = cmd.ToStage.ToString(),
        }, ct);

        return true;
    }
}
