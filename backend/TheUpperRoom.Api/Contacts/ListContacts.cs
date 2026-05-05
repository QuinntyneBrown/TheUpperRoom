using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Contacts;

public record ContactListRow(Guid Id, string FirstName, string LastName, string? Email, string? City);
public record ContactListResult(List<ContactListRow> Rows, int Total);

public record ListContactsQuery(int Page = 1, int Size = 25, string Sort = "lastName:asc") : IRequest<ContactListResult>;

public class ListContactsQueryHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<ListContactsQuery, ContactListResult>
{
    public async Task<ContactListResult> Handle(ListContactsQuery query, CancellationToken ct)
    {
        var isAdmin = currentUser.IsAdmin;
        var teamId = currentUser.TeamId;

        var q = db.Contacts.Where(c => isAdmin || c.TeamId == teamId);

        var (field, dir) = ParseSort(query.Sort);
        q = (field, dir) switch
        {
            ("firstName", "desc") => q.OrderByDescending(c => c.FirstName),
            ("firstName", _)      => q.OrderBy(c => c.FirstName),
            ("lastName", "desc")  => q.OrderByDescending(c => c.LastName),
            _                     => q.OrderBy(c => c.LastName),
        };

        var total = await q.CountAsync(ct);
        var rows = await q
            .Skip((query.Page - 1) * query.Size)
            .Take(query.Size)
            .Select(c => new ContactListRow(c.Id, c.FirstName, c.LastName, c.Email, c.City))
            .ToListAsync(ct);

        return new(rows, total);
    }

    private static (string field, string dir) ParseSort(string sort)
    {
        var parts = sort.Split(':');
        return (parts[0], parts.Length > 1 ? parts[1] : "asc");
    }
}
