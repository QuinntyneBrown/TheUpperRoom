using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Hackathons;

public record HackathonStageHistoryDto(Guid Id, string FromStage, string ToStage, Guid ChangedById, DateTime ChangedAt);
public record ProductMemberDto(Guid Id, Guid? UserId, Guid? ContactId);
public record ProductDto(Guid Id, string Name, string? Description, string? RepoUrl, string? DemoUrl, List<ProductMemberDto> Members);
public record HackathonPartnerDto(Guid Id, string Name, string City);

public record HackathonDetailDto(
    Guid Id,
    Guid TeamId,
    string Title,
    DateOnly StartDate,
    DateOnly EndDate,
    string HostCity,
    string Stage,
    int Version,
    List<HackathonStageHistoryDto> History,
    List<ProductDto> Products,
    List<HackathonPartnerDto> Partners);

public record GetHackathonQuery(Guid Id) : IRequest<HackathonDetailDto?>;

public class GetHackathonQueryHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<GetHackathonQuery, HackathonDetailDto?>
{
    public async Task<HackathonDetailDto?> Handle(GetHackathonQuery query, CancellationToken ct)
    {
        var h = await db.Hackathons.FirstOrDefaultAsync(
            x => x.Id == query.Id && (currentUser.IsAdmin || x.TeamId == currentUser.TeamId), ct);
        if (h is null) return null;

        var history = await db.HackathonStageHistories
            .Where(s => s.HackathonId == h.Id)
            .OrderByDescending(s => s.ChangedAt)
            .Select(s => new HackathonStageHistoryDto(s.Id, s.FromStage.ToString(), s.ToStage.ToString(), s.ChangedById, s.ChangedAt))
            .ToListAsync(ct);

        var rawProducts = await db.Products
            .Where(p => p.HackathonId == h.Id)
            .OrderBy(p => p.CreatedAt)
            .ToListAsync(ct);

        var productIds = rawProducts.Select(p => p.Id).ToList();
        var members = await db.ProductMembers
            .Where(m => productIds.Contains(m.ProductId))
            .ToListAsync(ct);

        var products = rawProducts.Select(p => new ProductDto(p.Id, p.Name, p.Description, p.RepoUrl, p.DemoUrl,
            members.Where(m => m.ProductId == p.Id)
                   .Select(m => new ProductMemberDto(m.Id, m.UserId, m.ContactId))
                   .ToList())).ToList();

        var partnerLinks = await db.HackathonPartners
            .Where(hp => hp.HackathonId == h.Id)
            .Select(hp => hp.PartnerId)
            .ToListAsync(ct);

        var partners = await db.Partners
            .Where(p => partnerLinks.Contains(p.Id))
            .Select(p => new HackathonPartnerDto(p.Id, p.Name, p.City))
            .ToListAsync(ct);

        return new HackathonDetailDto(h.Id, h.TeamId, h.Title, h.StartDate, h.EndDate, h.HostCity,
            h.Stage.ToString(), h.Version, history, products, partners);
    }
}
