using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Notifications;

public record NotificationDto(
    Guid Id, string Kind, string EntityType, Guid EntityId, Guid ActorId, DateTime CreatedAt, bool IsRead);

public record ListNotificationsResult(List<NotificationDto> Rows, int UnreadCount);

public record ListNotificationsQuery : IRequest<ListNotificationsResult>;

public class ListNotificationsQueryHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<ListNotificationsQuery, ListNotificationsResult>
{
    public async Task<ListNotificationsResult> Handle(ListNotificationsQuery query, CancellationToken ct)
    {
        var userId = currentUser.Id!.Value;
        var rows = await db.Notifications
            .Where(n => n.UserId == userId)
            .OrderBy(n => n.ReadAt.HasValue)
            .ThenByDescending(n => n.CreatedAt)
            .Take(50)
            .Select(n => new NotificationDto(n.Id, n.Kind, n.EntityType, n.EntityId, n.ActorId, n.CreatedAt, n.ReadAt.HasValue))
            .ToListAsync(ct);

        var unreadCount = await db.Notifications.CountAsync(n => n.UserId == userId && n.ReadAt == null, ct);
        return new ListNotificationsResult(rows, unreadCount);
    }
}
