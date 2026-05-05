using Microsoft.AspNetCore.SignalR;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Realtime;

public record TeamEvent(string EventType, Guid EntityId, Guid? ActorId, DateTime Timestamp, object? Data = null);

public static class Broadcast
{
    public static Task TeamEvent(
        IHubContext<TeamHub> hub,
        Guid teamId,
        string eventName,
        Guid entityId,
        ICurrentUser currentUser,
        object? data = null)
    {
        var evt = new TeamEvent(eventName, entityId, currentUser.Id, DateTime.UtcNow, data);
        return hub.Clients.Group($"team:{teamId}").SendAsync(eventName, evt);
    }
}
