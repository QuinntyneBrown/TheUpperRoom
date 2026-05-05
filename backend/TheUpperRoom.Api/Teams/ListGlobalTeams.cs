using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Teams;

public record GlobalTeamSummaryDto(
    Guid Id,
    string City,
    int MemberCount,
    int PrayerLeadCount,
    int EventLeadCount,
    int CommunicationLeadCount,
    int ActiveHackathonCount,
    int PartnerCount);

public record ListGlobalTeamsResult(List<GlobalTeamSummaryDto> Rows, int Total);

public record ListGlobalTeamsQuery(int Page = 1, int Size = 25, string? Search = null)
    : IRequest<ListGlobalTeamsResult>;

public class ListGlobalTeamsQueryHandler(AppDbContext db)
    : IRequestHandler<ListGlobalTeamsQuery, ListGlobalTeamsResult>
{
    public async Task<ListGlobalTeamsResult> Handle(ListGlobalTeamsQuery query, CancellationToken ct)
    {
        var users = await (
            from u in db.Users
            join ur in db.UserRoles on u.Id equals ur.UserId
            join r in db.Roles on ur.RoleId equals r.Id
            where u.TeamId.HasValue && u.EmailConfirmed
            select new { u.Id, u.TeamId, u.DisplayName, u.City, Role = r.Name! }
        ).ToListAsync(ct);

        var teamGroups = users
            .GroupBy(u => u.TeamId!.Value)
            .ToList();

        if (!string.IsNullOrEmpty(query.Search))
        {
            var term = query.Search.Trim();
            teamGroups = teamGroups
                .Where(g => g.Any(u =>
                    u.City.Contains(term, StringComparison.OrdinalIgnoreCase) ||
                    u.DisplayName.Contains(term, StringComparison.OrdinalIgnoreCase)))
                .ToList();
        }

        var teamIds = teamGroups.Select(g => g.Key).ToList();

        var hackathonCounts = await db.Hackathons
            .Where(h => teamIds.Contains(h.TeamId) && h.Stage != Domain.HackathonStage.Launch)
            .GroupBy(h => h.TeamId)
            .Select(g => new { TeamId = g.Key, Count = g.Count() })
            .ToListAsync(ct);

        var partnerCounts = await db.Partners
            .Where(p => teamIds.Contains(p.TeamId))
            .GroupBy(p => p.TeamId)
            .Select(g => new { TeamId = g.Key, Count = g.Count() })
            .ToListAsync(ct);

        var hackathonMap = hackathonCounts.ToDictionary(x => x.TeamId, x => x.Count);
        var partnerMap = partnerCounts.ToDictionary(x => x.TeamId, x => x.Count);

        var total = teamGroups.Count;
        var rows = teamGroups
            .Skip((query.Page - 1) * query.Size)
            .Take(query.Size)
            .Select(g =>
            {
                var members = g.ToList();
                var cityLead = members.FirstOrDefault(m => m.Role == Roles.CityLead);
                var city = cityLead?.City ?? members.First().City;
                return new GlobalTeamSummaryDto(
                    g.Key,
                    city,
                    members.Select(m => m.Id).Distinct().Count(),
                    members.Count(m => m.Role == Roles.PrayerLead),
                    members.Count(m => m.Role == Roles.EventLead),
                    members.Count(m => m.Role == Roles.CommunicationLead),
                    hackathonMap.GetValueOrDefault(g.Key),
                    partnerMap.GetValueOrDefault(g.Key));
            })
            .ToList();

        return new ListGlobalTeamsResult(rows, total);
    }
}
