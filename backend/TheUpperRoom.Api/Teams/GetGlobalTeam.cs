using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Teams;

public record GlobalTeamPublicDto(
    Guid Id,
    string City,
    int MemberCount,
    int PrayerLeadCount,
    int EventLeadCount,
    int CommunicationLeadCount,
    int ActiveHackathonCount,
    int PartnerCount);

public record GlobalTeamAdminDto(
    Guid Id,
    string City,
    List<TeamMemberDto> Members,
    int ActiveHackathonCount,
    int PartnerCount);

public record GetGlobalTeamQuery(Guid Id) : IRequest<object?>;

public class GetGlobalTeamQueryHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<GetGlobalTeamQuery, object?>
{
    private static readonly IReadOnlyDictionary<string, int> RolePriority = new Dictionary<string, int>
    {
        ["Admin"] = 0,
        ["CityLead"] = 1,
        ["PrayerLead"] = 2,
        ["EventLead"] = 3,
        ["CommunicationLead"] = 4,
    };

    public async Task<object?> Handle(GetGlobalTeamQuery query, CancellationToken ct)
    {
        var rows = await (
            from u in db.Users
            join ur in db.UserRoles on u.Id equals ur.UserId
            join r in db.Roles on ur.RoleId equals r.Id
            where u.TeamId == query.Id && u.EmailConfirmed
            select new { u.Id, u.DisplayName, u.Email, Role = r.Name!, u.City, u.LockoutEnd }
        ).ToListAsync(ct);

        if (rows.Count == 0) return null;

        var activeHackathonCount = await db.Hackathons
            .CountAsync(h => h.TeamId == query.Id && h.Stage != Domain.HackathonStage.Launch, ct);

        var partnerCount = await db.Partners
            .CountAsync(p => p.TeamId == query.Id, ct);

        var cityLead = rows.FirstOrDefault(m => m.Role == Roles.CityLead);
        var city = cityLead?.City ?? rows.First().City;

        if (currentUser.IsAdmin)
        {
            var members = rows
                .GroupBy(m => m.Id)
                .Select(g =>
                {
                    var first = g.First();
                    var roles = g.Select(m => m.Role).ToArray();
                    var topRole = roles.MinBy(r => RolePriority.GetValueOrDefault(r, 99)) ?? roles[0];
                    return (Member: first, Roles: roles, TopPriority: RolePriority.GetValueOrDefault(topRole, 99));
                })
                .OrderBy(x => x.TopPriority)
                .ThenBy(x => x.Member.DisplayName)
                .Select(x => new TeamMemberDto(
                    x.Member.Id,
                    x.Member.DisplayName,
                    x.Member.Email ?? "",
                    x.Roles,
                    x.Member.LockoutEnd == null || x.Member.LockoutEnd < DateTimeOffset.UtcNow))
                .ToList();

            return new GlobalTeamAdminDto(query.Id, city, members, activeHackathonCount, partnerCount);
        }

        var memberCount = rows.Select(m => m.Id).Distinct().Count();
        return new GlobalTeamPublicDto(
            query.Id,
            city,
            memberCount,
            rows.Count(m => m.Role == Roles.PrayerLead),
            rows.Count(m => m.Role == Roles.EventLead),
            rows.Count(m => m.Role == Roles.CommunicationLead),
            activeHackathonCount,
            partnerCount);
    }
}
