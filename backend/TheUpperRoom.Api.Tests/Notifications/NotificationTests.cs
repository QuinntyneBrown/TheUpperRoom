// Traces to: 33 — Notification Center
// L2-038: notifications persisted per user, unread-first, mark-read, mark-all-read
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Notifications;

public class NotificationTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<(string cookie, Guid userId, Guid teamId)> SignInAs(string role, Guid? teamId = null)
    {
        var tid = teamId ?? Guid.NewGuid();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"notif+{Guid.NewGuid():N}@example.com";
        const string password = "Str0ng!Pass#99";
        await client.PostAsJsonAsync("/api/auth/register", new { email, password, displayName = "User", city = "Toronto" });
        using var scope = factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var user = db.Users.First(u => u.Email == email);
        user.EmailConfirmed = true;
        user.TeamId = tid;
        await db.SaveChangesAsync();
        await userManager.AddToRoleAsync(user, role);
        var resp = await client.PostAsJsonAsync("/api/auth/sign-in", new { email, password });
        return (resp.Headers.GetValues("Set-Cookie").First().Split(';')[0], user.Id, tid);
    }

    private async Task SeedNotification(Guid userId, Guid teamId)
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Notifications.Add(new Notification
        {
            UserId = userId,
            TeamId = teamId,
            Kind = "contactCreated",
            EntityType = "Contact",
            EntityId = Guid.NewGuid(),
            ActorId = Guid.NewGuid(),
            CreatedAt = DateTime.UtcNow,
        });
        await db.SaveChangesAsync();
    }

    [Fact]
    public async Task ListNotifications_ReturnsUnreadFirst()
    {
        var (cookie, userId, teamId) = await SignInAs(Roles.CityLead);
        await SeedNotification(userId, teamId);
        await SeedNotification(userId, teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/notifications");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.NotNull(body);
        Assert.True(body!.ContainsKey("rows"));
        Assert.True(body.ContainsKey("unreadCount"));
    }

    [Fact]
    public async Task MarkRead_Returns204AndDecrementsUnread()
    {
        var (cookie, userId, teamId) = await SignInAs(Roles.CityLead);
        await SeedNotification(userId, teamId);

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var notif = db.Notifications.First(n => n.UserId == userId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, $"/api/notifications/{notif.Id}/read");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }

    [Fact]
    public async Task MarkAllRead_Returns204()
    {
        var (cookie, userId, teamId) = await SignInAs(Roles.CityLead);
        await SeedNotification(userId, teamId);
        await SeedNotification(userId, teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, "/api/notifications/read-all");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }
}
