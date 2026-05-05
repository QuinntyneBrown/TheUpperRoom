using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Contacts;

public record ContactSearchResult(Guid Id, string FirstName, string LastName, string? City, string Snippet, string MatchedField);

public record SearchContactsQuery(string Term) : IRequest<IEnumerable<ContactSearchResult>>;

public class SearchContactsQueryHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<SearchContactsQuery, IEnumerable<ContactSearchResult>>
{
    public async Task<IEnumerable<ContactSearchResult>> Handle(SearchContactsQuery query, CancellationToken ct)
    {
        var term = query.Term;
        var isAdmin = currentUser.IsAdmin;
        var teamId = currentUser.TeamId;

        var contactMatches = await db.Contacts
            .Where(c => (isAdmin || c.TeamId == teamId) &&
                (EF.Functions.Like(c.FirstName, $"%{term}%") ||
                 EF.Functions.Like(c.LastName, $"%{term}%") ||
                 EF.Functions.Like(c.Email ?? "", $"%{term}%") ||
                 EF.Functions.Like(c.Phone ?? "", $"%{term}%")))
            .Select(c => new { c.Id, c.FirstName, c.LastName, c.City, c.Email, c.Phone })
            .Take(50)
            .ToListAsync(ct);

        var noteMatches = await db.Notes
            .Where(n => n.TargetType == "Contact" && EF.Functions.Like(n.Body, $"%{term}%"))
            .Join(db.Contacts.Where(c => isAdmin || c.TeamId == teamId),
                  n => n.TargetId, c => c.Id,
                  (n, c) => new { c.Id, c.FirstName, c.LastName, c.City, n.Body })
            .Take(50)
            .ToListAsync(ct);

        var results = new List<ContactSearchResult>();
        var seen = new HashSet<Guid>();

        foreach (var c in contactMatches)
        {
            seen.Add(c.Id);
            var (snippet, field) = FieldSnippet(c.FirstName, c.LastName, c.Email, c.Phone, term);
            results.Add(new(c.Id, c.FirstName, c.LastName, c.City, snippet, field));
        }

        foreach (var m in noteMatches)
        {
            if (!seen.Add(m.Id)) continue;
            results.Add(new(m.Id, m.FirstName, m.LastName, m.City, Excerpt(m.Body, term), "note"));
        }

        return results.Take(50);
    }

    private static (string snippet, string field) FieldSnippet(string fn, string ln, string? email, string? phone, string term)
    {
        if (fn.Contains(term, StringComparison.OrdinalIgnoreCase)) return (Excerpt(fn, term), "firstName");
        if (ln.Contains(term, StringComparison.OrdinalIgnoreCase)) return (Excerpt(ln, term), "lastName");
        if (email?.Contains(term, StringComparison.OrdinalIgnoreCase) == true) return (Excerpt(email, term), "email");
        if (phone?.Contains(term, StringComparison.OrdinalIgnoreCase) == true) return (Excerpt(phone, term), "phone");
        return ("", "");
    }

    private static string Excerpt(string text, string term)
    {
        var i = text.IndexOf(term, StringComparison.OrdinalIgnoreCase);
        if (i < 0) return text[..Math.Min(80, text.Length)];
        var start = Math.Max(0, i - 20);
        var end = Math.Min(text.Length, i + term.Length + 20);
        return (start > 0 ? "…" : "") + text[start..end] + (end < text.Length ? "…" : "");
    }
}
