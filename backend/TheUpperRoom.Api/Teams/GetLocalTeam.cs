using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Teams;

public record TeamMemberDto(Guid Id, string DisplayName, string Email, string[] Roles, bool IsActive);

public record GetLocalTeamQuery : IRequest<List<TeamMemberDto>>;

public class GetLocalTeamQueryHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<GetLocalTeamQuery, List<TeamMemberDto>>
{
    private static readonly IReadOnlyDictionary<string, int> RolePriority = new Dictionary<string, int>
    {
        ["Admin"] = 0,
        ["CityLead"] = 1,
        ["PrayerLead"] = 2,
        ["EventLead"] = 3,
        ["CommunicationLead"] = 4,
    };

    public async Task<List<TeamMemberDto>> Handle(GetLocalTeamQuery query, CancellationToken ct)
    {
        var teamId = currentUser.TeamId ?? Guid.Empty;

        var rows = await (
            from u in db.Users
            join ur in db.UserRoles on u.Id equals ur.UserId
            join r in db.Roles on ur.RoleId equals r.Id
            where (currentUser.IsAdmin || u.TeamId == teamId) && u.EmailConfirmed
            select new { u.Id, u.DisplayName, u.Email, Role = r.Name!, u.LockoutEnabled, u.LockoutEnd }
        ).ToListAsync(ct);

        return rows
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
    }
}
