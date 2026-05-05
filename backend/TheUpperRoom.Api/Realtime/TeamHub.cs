using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Realtime;

[Authorize]
public class TeamHub(ICurrentUser currentUser) : Hub
{
    public override async Task OnConnectedAsync()
    {
        if (currentUser.TeamId.HasValue)
            await Groups.AddToGroupAsync(Context.ConnectionId, $"team:{currentUser.TeamId}");
        await base.OnConnectedAsync();
    }
}
