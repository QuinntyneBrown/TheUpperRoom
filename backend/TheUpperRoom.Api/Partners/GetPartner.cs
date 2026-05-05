using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Contacts;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Partners;

public record PartnerStageHistoryDto(
    Guid Id,
    string FromStage,
    string ToStage,
    Guid ChangedById,
    DateTime ChangedAt);

public record PartnerContactDto(Guid Id, string FirstName, string LastName, string? Email);

public record PartnerDetailDto(
    Guid Id,
    Guid TeamId,
    string Name,
    string? Website,
    string City,
    string Stage,
    string? Description,
    int Version,
    List<PartnerStageHistoryDto> History,
    List<PartnerContactDto> Contacts,
    List<NoteDto> Notes);

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

        var contacts = await (
            from pc in db.PartnerContacts
            join c in db.Contacts on pc.ContactId equals c.Id
            where pc.PartnerId == partner.Id
            select new PartnerContactDto(c.Id, c.FirstName, c.LastName, c.Email))
            .ToListAsync(ct);

        var notes = await db.Notes
            .Where(n => n.TargetType == "Partner" && n.TargetId == partner.Id)
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new NoteDto(n.Id, n.Body, n.AuthorId, n.CreatedAt))
            .ToListAsync(ct);

        return new PartnerDetailDto(
            partner.Id, partner.TeamId, partner.Name, partner.Website, partner.City,
            partner.Stage.ToString(), partner.Description, partner.Version, history, contacts, notes);
    }
}
