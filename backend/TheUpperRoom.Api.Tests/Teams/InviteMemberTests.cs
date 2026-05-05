// Traces to: 26 — Invite Team Member
// L2-027: invite creates record; invite link sent; accept-invite flow joins team + assigns roles; non-lead → 403
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Teams;

public class InviteMemberTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<(string cookie, Guid userId, Guid teamId)> SignInAs(string role)
    {
        var teamId = Guid.NewGuid();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"inv+{Guid.NewGuid():N}@example.com";
        const string password = "Str0ng!Pass#99";
        await client.PostAsJsonAsync("/api/auth/register", new { email, password, displayName = "Lead", city = "Toronto" });
        using var scope = factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var user = db.Users.First(u => u.Email == email);
        user.EmailConfirmed = true;
        user.TeamId = teamId;
        await db.SaveChangesAsync();
        await userManager.AddToRoleAsync(user, role);
        var resp = await client.PostAsJsonAsync("/api/auth/sign-in", new { email, password });
        return (resp.Headers.GetValues("Set-Cookie").First().Split(';')[0], user.Id, teamId);
    }

    [Fact]
    public async Task InviteMember_CityLead_Returns200AndPersistsInvitation()
    {
        var (cookie, _, teamId) = await SignInAs(Roles.CityLead);
        var inviteEmail = $"newmember+{Guid.NewGuid():N}@example.com";

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, "/api/teams/local/invitations");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { email = inviteEmail, roles = new[] { Roles.PrayerLead } });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var inv = db.Invitations.FirstOrDefault(i => i.Email == inviteEmail);
        Assert.NotNull(inv);
        Assert.Equal(teamId, inv!.TeamId);
        Assert.True(inv.ExpiresAt > DateTime.UtcNow.AddDays(6));
    }

    [Fact]
    public async Task InviteMember_PrayerLead_Returns403()
    {
        var (cookie, _, _) = await SignInAs(Roles.PrayerLead);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, "/api/teams/local/invitations");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { email = "newmember@example.com", roles = new[] { Roles.PrayerLead } });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task AcceptInvite_RegisterWithToken_JoinsTeamAndAssignsRoles()
    {
        var (cookie, inviterId, teamId) = await SignInAs(Roles.CityLead);
        var inviteEmail = $"join+{Guid.NewGuid():N}@example.com";

        // Create invitation
        var client = factory.CreateClient();
        var invReq = new HttpRequestMessage(HttpMethod.Post, "/api/teams/local/invitations");
        invReq.Headers.Add("Cookie", cookie);
        invReq.Content = JsonContent.Create(new { email = inviteEmail, roles = new[] { Roles.EventLead } });
        await client.SendAsync(invReq);

        // Get the raw token from db
        string rawToken;
        using (var scope = factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var inv = db.Invitations.First(i => i.Email == inviteEmail);
            rawToken = inv.Token; // stored as plain in test scenario (see implementation note)
        }

        // Register with invite token
        var registerResp = await client.PostAsJsonAsync("/api/auth/register", new
        {
            email = inviteEmail,
            password = "Str0ng!Pass#99",
            displayName = "New Member",
            city = "Toronto",
            inviteToken = rawToken
        });

        Assert.Equal(HttpStatusCode.OK, registerResp.StatusCode);

        // Verify team assignment and role
        using var verifyScope = factory.Services.CreateScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<AppDbContext>();
        var userManager = verifyScope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var user = verifyDb.Users.FirstOrDefault(u => u.Email == inviteEmail);
        Assert.NotNull(user);
        Assert.Equal(teamId, user!.TeamId);
        var roles = await userManager.GetRolesAsync(user);
        Assert.Contains(Roles.EventLead, roles);
    }
}
