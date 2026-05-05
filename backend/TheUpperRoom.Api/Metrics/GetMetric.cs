using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Metrics;

public record MetricPoint(string Label, int Value);
public record MetricDto(string Metric, List<MetricPoint> Series);
public record GetMetricQuery(string Metric, DateTime FromUtc, DateTime ToUtc, string Bucket) : IRequest<MetricDto?>;

public class GetMetricQueryHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<GetMetricQuery, MetricDto?>
{
    public async Task<MetricDto?> Handle(GetMetricQuery q, CancellationToken ct)
    {
        var teamId = currentUser.IsAdmin ? (Guid?)null : currentUser.TeamId;

        return q.Metric switch
        {
            "contactsCreatedDaily" => await ContactsCreatedDaily(teamId, q, ct),
            "partnerStageTransitionsWeekly" => await PartnerTransitionsWeekly(teamId, q, ct),
            "hackathonStageProgress" => await HackathonStageProgress(teamId, q, ct),
            _ => null,
        };
    }

    private async Task<MetricDto> ContactsCreatedDaily(Guid? teamId, GetMetricQuery q, CancellationToken ct)
    {
        var contacts = await db.Contacts
            .Where(c => (teamId == null || c.TeamId == teamId)
                && c.CreatedAt >= q.FromUtc && c.CreatedAt <= q.ToUtc)
            .Select(c => c.CreatedAt.Date)
            .ToListAsync(ct);

        var series = contacts
            .GroupBy(d => d)
            .OrderBy(g => g.Key)
            .Select(g => new MetricPoint(g.Key.ToString("yyyy-MM-dd"), g.Count()))
            .ToList();

        return new MetricDto(q.Metric, series);
    }

    private async Task<MetricDto> PartnerTransitionsWeekly(Guid? teamId, GetMetricQuery q, CancellationToken ct)
    {
        var histories = await db.PartnerStageHistories
            .Where(h => h.ChangedAt >= q.FromUtc && h.ChangedAt <= q.ToUtc)
            .Select(h => new { h.PartnerId, h.ChangedAt })
            .ToListAsync(ct);

        if (teamId.HasValue)
        {
            var teamPartnerIds = await db.Partners
                .Where(p => p.TeamId == teamId.Value)
                .Select(p => p.Id)
                .ToListAsync(ct);
            histories = histories.Where(h => teamPartnerIds.Contains(h.PartnerId)).ToList();
        }

        var series = histories
            .GroupBy(h => StartOfWeek(h.ChangedAt))
            .OrderBy(g => g.Key)
            .Select(g => new MetricPoint(g.Key.ToString("yyyy-MM-dd"), g.Count()))
            .ToList();

        return new MetricDto(q.Metric, series);
    }

    private async Task<MetricDto> HackathonStageProgress(Guid? teamId, GetMetricQuery q, CancellationToken ct)
    {
        var histories = await db.HackathonStageHistories
            .Where(h => h.ChangedAt >= q.FromUtc && h.ChangedAt <= q.ToUtc)
            .Select(h => new { h.HackathonId, h.ToStage, h.ChangedAt })
            .ToListAsync(ct);

        if (teamId.HasValue)
        {
            var teamHackathonIds = await db.Hackathons
                .Where(h => h.TeamId == teamId.Value)
                .Select(h => h.Id)
                .ToListAsync(ct);
            histories = histories.Where(h => teamHackathonIds.Contains(h.HackathonId)).ToList();
        }

        var series = histories
            .GroupBy(h => h.ToStage.ToString())
            .OrderBy(g => g.Key)
            .Select(g => new MetricPoint(g.Key, g.Count()))
            .ToList();

        return new MetricDto(q.Metric, series);
    }

    private static DateTime StartOfWeek(DateTime dt)
    {
        var diff = (7 + (dt.DayOfWeek - DayOfWeek.Monday)) % 7;
        return dt.AddDays(-diff).Date;
    }
}
