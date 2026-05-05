using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Partners;

public record PartnerStageHistoryDto(
    Guid Id,
    string FromStage,
    string ToStage,
    Guid ChangedById,
    DateTime ChangedAt);

public record PartnerDetailDto(
    Guid Id,
    Guid TeamId,
    string Name,
    string? Website,
    string City,
    string Stage,
    string? Description,
    int Version,
    List<PartnerStageHistoryDto> History);

public record GetPartnerQuery(Guid Id) : IRequest<PartnerDetailDto?>;

public class GetPartnerQueryHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<GetPartnerQuery, PartnerDetailDto?>
{
    public async Task<PartnerDetailDto?> Handle(GetPartnerQuery query, CancellationToken ct)
    {
        var partner = await db.Partners.FirstOrDefaultAsync(
            p => p.Id == query.Id && (currentUser.IsAdmin || p.TeamId == currentUser.TeamId), ct);
        if (partner is null) return null;

        var history = await db.PartnerStageHistories
            .Where(h => h.PartnerId == partner.Id)
            .OrderByDescending(h => h.ChangedAt)
            .Select(h => new PartnerStageHistoryDto(h.Id, h.FromStage.ToString(), h.ToStage.ToString(), h.ChangedById, h.ChangedAt))
            .ToListAsync(ct);

        return new PartnerDetailDto(
            partner.Id, partner.TeamId, partner.Name, partner.Website, partner.City,
            partner.Stage.ToString(), partner.Description, partner.Version, history);
    }
}
