// Traces to: 10 — Update Contact
// L2-011: edit succeeds, UpdatedAt/UpdatedById advance; stale version → 409
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Contacts;

public class UpdateContactTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<(string cookie, Guid userId)> SignInAsTeamMember(Guid teamId)
    {
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"upd+{Guid.NewGuid():N}@example.com";
        const string password = "Str0ng!Pass#99";
        await client.PostAsJsonAsync("/api/auth/register",
            new { email, password, displayName = "Lead", city = "Dublin" });
        using var scope = factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var user = db.Users.First(u => u.Email == email);
        user.EmailConfirmed = true;
        user.TeamId = teamId;
        await db.SaveChangesAsync();
        await userManager.AddToRoleAsync(user, Roles.CityLead);
        var resp = await client.PostAsJsonAsync("/api/auth/sign-in", new { email, password });
        return (resp.Headers.GetValues("Set-Cookie").First().Split(';')[0], user.Id);
    }

    private async Task<Contact> SeedContact(Guid teamId)
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var contact = new Contact { TeamId = teamId, FirstName = "Ada", LastName = "Lovelace" };
        db.Contacts.Add(contact);
        await db.SaveChangesAsync();
        return contact;
    }

    [Fact]
    public async Task UpdateContact_ValidVersion_Returns200()
    {
        var teamId = Guid.NewGuid();
        var (cookie, _) = await SignInAsTeamMember(teamId);
        var contact = await SeedContact(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Put, $"/api/contacts/{contact.Id}");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new
        {
            firstName = "Grace",
            lastName = "Hopper",
            version = contact.Version
        });

        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task UpdateContact_StaleVersion_Returns409()
    {
        var teamId = Guid.NewGuid();
        var (cookie, _) = await SignInAsTeamMember(teamId);
        var contact = await SeedContact(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Put, $"/api/contacts/{contact.Id}");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new
        {
            firstName = "Grace",
            lastName = "Hopper",
            version = contact.Version + 99
        });

        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }

    [Fact]
    public async Task UpdateContact_UpdatedAtAdvances()
    {
        var teamId = Guid.NewGuid();
        var (cookie, userId) = await SignInAsTeamMember(teamId);
        var contact = await SeedContact(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Put, $"/api/contacts/{contact.Id}");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new
        {
            firstName = "Grace",
            lastName = "Hopper",
            version = contact.Version
        });

        await client.SendAsync(req);

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var updated = db.Contacts.First(c => c.Id == contact.Id);
        Assert.NotNull(updated.UpdatedAt);
        Assert.Equal(userId, updated.UpdatedById);
        Assert.Equal(1, updated.Version);
    }

    [Fact]
    public async Task UpdateContact_CrossTeam_Returns404()
    {
        var team1 = Guid.NewGuid();
        var team2 = Guid.NewGuid();
        var (cookie, _) = await SignInAsTeamMember(team1);
        var contact = await SeedContact(team2);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Put, $"/api/contacts/{contact.Id}");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new
        {
            firstName = "X",
            lastName = "Y",
            version = contact.Version
        });

        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
