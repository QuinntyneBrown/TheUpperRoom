using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;
using TheUpperRoom.Api.Realtime;

namespace TheUpperRoom.Api.Partners;

public record ChangePartnerStageCommand(Guid PartnerId, PartnerStage ToStage) : IRequest<bool>;

public class ChangePartnerStageCommandValidator : AbstractValidator<ChangePartnerStageCommand>
{
    public ChangePartnerStageCommandValidator()
    {
        RuleFor(x => x.ToStage).IsInEnum();
    }
}

public class ChangePartnerStageCommandHandler(
    AppDbContext db,
    ICurrentUser currentUser,
    IHubContext<TeamHub> hub)
    : IRequestHandler<ChangePartnerStageCommand, bool>
{
    public async Task<bool> Handle(ChangePartnerStageCommand cmd, CancellationToken ct)
    {
        var partner = await db.Partners.FirstOrDefaultAsync(
            p => p.Id == cmd.PartnerId && (currentUser.IsAdmin || p.TeamId == currentUser.TeamId), ct);
        if (partner is null) return false;

        var fromStage = partner.Stage;
        partner.Stage = cmd.ToStage;

        db.PartnerStageHistories.Add(new PartnerStageHistory
        {
            PartnerId = partner.Id,
            FromStage = fromStage,
            ToStage = cmd.ToStage,
            ChangedById = currentUser.Id ?? Guid.Empty,
        });

        await db.SaveChangesAsync(ct);

        await hub.Clients.Group($"team:{partner.TeamId}").SendAsync("partnerStageChanged", new
        {
            eventType = "partnerStageChanged",
            entityId = partner.Id,
            actorId = currentUser.Id,
            timestamp = DateTime.UtcNow,
            partnerId = partner.Id,
            fromStage = fromStage.ToString(),
            toStage = cmd.ToStage.ToString(),
        }, ct);

        return true;
    }
}
