using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Search;

public record SearchResultItem(Guid Id, string Label, string Type);
public record GlobalSearchResult(
    List<SearchResultItem> Contacts,
    List<SearchResultItem> Partners,
    List<SearchResultItem> Hackathons,
    List<SearchResultItem> Members);

public record GlobalSearchQuery(string Term) : IRequest<GlobalSearchResult>;

public class GlobalSearchQueryHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<GlobalSearchQuery, GlobalSearchResult>
{
    public async Task<GlobalSearchResult> Handle(GlobalSearchQuery query, CancellationToken ct)
    {
        var teamId = currentUser.TeamId ?? Guid.Empty;
        var term = query.Term.ToLower();

        var contactsTask = db.Contacts
            .Where(c => c.TeamId == teamId &&
                (c.FirstName.ToLower().Contains(term) || c.LastName.ToLower().Contains(term) ||
                 (c.Email != null && c.Email.ToLower().Contains(term))))
            .Take(10)
            .Select(c => new SearchResultItem(c.Id, $"{c.FirstName} {c.LastName}", "contact"))
            .ToListAsync(ct);

        var partnersTask = db.Partners
            .Where(p => p.TeamId == teamId && p.Name.ToLower().Contains(term))
            .Take(10)
            .Select(p => new SearchResultItem(p.Id, p.Name, "partner"))
            .ToListAsync(ct);

        var hackathonsTask = db.Hackathons
            .Where(h => h.TeamId == teamId && h.Title.ToLower().Contains(term))
            .Take(10)
            .Select(h => new SearchResultItem(h.Id, h.Title, "hackathon"))
            .ToListAsync(ct);

        var membersTask = (
            from u in db.Users
            where u.TeamId == teamId && u.EmailConfirmed &&
                (u.DisplayName.ToLower().Contains(term) || (u.Email != null && u.Email.ToLower().Contains(term)))
            select new SearchResultItem(u.Id, u.DisplayName, "member")
        ).Take(10).ToListAsync(ct);

        await Task.WhenAll(contactsTask, partnersTask, hackathonsTask, membersTask);

        return new GlobalSearchResult(
            await contactsTask,
            await partnersTask,
            await hackathonsTask,
            await membersTask);
    }
}
