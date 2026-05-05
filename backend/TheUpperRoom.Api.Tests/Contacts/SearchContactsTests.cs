// Traces to: 13 — Search Contacts
// L2-014: search across name/email/phone/notes, team-scoped, max 50 results
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Contacts;

public class SearchContactsTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<string> SignInAsTeamMember(Guid teamId)
    {
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"search+{Guid.NewGuid():N}@example.com";
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
        return resp.Headers.GetValues("Set-Cookie").First().Split(';')[0];
    }

    private async Task SeedContact(Guid teamId, string firstName, string lastName, string? email = null, string? noteBody = null)
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var contact = new Contact { TeamId = teamId, FirstName = firstName, LastName = lastName, Email = email };
        db.Contacts.Add(contact);
        if (noteBody is not null)
            db.Notes.Add(new Note { TargetType = "Contact", TargetId = contact.Id, AuthorId = Guid.Empty, Body = noteBody });
        await db.SaveChangesAsync();
    }

    [Fact]
    public async Task Search_ByFirstName_ReturnsMatch()
    {
        var teamId = Guid.NewGuid();
        var cookie = await SignInAsTeamMember(teamId);
        await SeedContact(teamId, "Zenobia", "Clarke");

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/contacts?search=zeno");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var results = await response.Content.ReadFromJsonAsync<List<Dictionary<string, object>>>();
        Assert.Contains(results!, r => r["firstName"].ToString() == "Zenobia");
    }

    [Fact]
    public async Task Search_ByNoteBody_ReturnsMatch()
    {
        var teamId = Guid.NewGuid();
        var cookie = await SignInAsTeamMember(teamId);
        await SeedContact(teamId, "Ada", "Lovelace", noteBody: "partner kickoff meeting");

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/contacts?search=kickoff");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var results = await response.Content.ReadFromJsonAsync<List<Dictionary<string, object>>>();
        Assert.Contains(results!, r => r["firstName"].ToString() == "Ada");
    }

    [Fact]
    public async Task Search_CrossTeamContact_NotReturned()
    {
        var teamId = Guid.NewGuid();
        var cookie = await SignInAsTeamMember(teamId);
        await SeedContact(Guid.NewGuid(), "OtherTeam", "Person"); // different team

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/contacts?search=OtherTeam");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var results = await response.Content.ReadFromJsonAsync<List<Dictionary<string, object>>>();
        Assert.DoesNotContain(results!, r => r["firstName"].ToString() == "OtherTeam");
    }

    [Fact]
    public async Task Search_Unauthenticated_Returns401()
    {
        var response = await factory.CreateClient().GetAsync("/api/contacts?search=test");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
