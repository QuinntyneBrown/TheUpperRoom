using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Notifications;

public record MarkReadCommand(Guid? NotificationId) : IRequest;

public class MarkReadCommandHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<MarkReadCommand>
{
    public async Task Handle(MarkReadCommand cmd, CancellationToken ct)
    {
        var userId = currentUser.Id!.Value;
        var now = DateTime.UtcNow;

        if (cmd.NotificationId.HasValue)
        {
            var notif = await db.Notifications.FirstOrDefaultAsync(
                n => n.Id == cmd.NotificationId.Value && n.UserId == userId, ct);
            if (notif is { ReadAt: null })
                notif.ReadAt = now;
        }
        else
        {
            await db.Notifications
                .Where(n => n.UserId == userId && n.ReadAt == null)
                .ExecuteUpdateAsync(s => s.SetProperty(n => n.ReadAt, now), ct);
        }

        await db.SaveChangesAsync(ct);
    }
}
