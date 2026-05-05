using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Admin;

public record DeletedContactDto(Guid Id, string Name, DateTime DeletedAt, Guid TeamId);
public record ListDeletedContactsQuery : IRequest<List<DeletedContactDto>>;

public class ListDeletedContactsHandler(AppDbContext db)
    : IRequestHandler<ListDeletedContactsQuery, List<DeletedContactDto>>
{
    public async Task<List<DeletedContactDto>> Handle(ListDeletedContactsQuery _, CancellationToken ct) =>
        await db.Contacts
            .IgnoreQueryFilters()
            .Where(c => c.DeletedAt != null)
            .OrderByDescending(c => c.DeletedAt)
            .Select(c => new DeletedContactDto(
                c.Id,
                $"{c.FirstName} {c.LastName}".Trim(),
                c.DeletedAt!.Value,
                c.TeamId))
            .ToListAsync(ct);
}
