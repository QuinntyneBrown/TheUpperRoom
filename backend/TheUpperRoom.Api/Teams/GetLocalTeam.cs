using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Teams;

public record TeamMemberDto(Guid Id, string DisplayName, string Email, string Role, bool IsActive);

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

        var members = await (
            from u in db.Users
            join ur in db.UserRoles on u.Id equals ur.UserId
            join r in db.Roles on ur.RoleId equals r.Id
            where (currentUser.IsAdmin || u.TeamId == teamId) && u.EmailConfirmed
            select new { u.Id, u.DisplayName, u.Email, Role = r.Name!, u.LockoutEnabled, u.LockoutEnd }
        ).ToListAsync(ct);

        return members
            .OrderBy(m => RolePriority.GetValueOrDefault(m.Role, 99))
            .ThenBy(m => m.DisplayName)
            .Select(m => new TeamMemberDto(
                m.Id,
                m.DisplayName,
                m.Email ?? "",
                m.Role,
                m.LockoutEnd == null || m.LockoutEnd < DateTimeOffset.UtcNow))
            .ToList();
    }
}
