// Traces to: 12 — Contact Notes
// L2-013: add/edit/delete notes; author-only for edit/delete; 4001-char body → 400
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Notes;

public class ContactNotesTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<(string cookie, Guid userId)> SignInAsTeamMember(Guid teamId, string role = "CityLead")
    {
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"note+{Guid.NewGuid():N}@example.com";
        const string password = "Str0ng!Pass#99";
        await client.PostAsJsonAsync("/api/auth/register",
            new { email, password, displayName = "User", city = "Dublin" });
        using var scope = factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var user = db.Users.First(u => u.Email == email);
        user.EmailConfirmed = true;
        user.TeamId = teamId;
        await db.SaveChangesAsync();
        await userManager.AddToRoleAsync(user, role);
        var resp = await client.PostAsJsonAsync("/api/auth/sign-in", new { email, password });
        return (resp.Headers.GetValues("Set-Cookie").First().Split(';')[0], user.Id);
    }

    private async Task<Guid> SeedContact(Guid teamId)
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var contact = new Contact { TeamId = teamId, FirstName = "Ada", LastName = "Lovelace" };
        db.Contacts.Add(contact);
        await db.SaveChangesAsync();
        return contact.Id;
    }

    [Fact]
    public async Task AddNote_ValidBody_Returns201WithNoteDto()
    {
        var teamId = Guid.NewGuid();
        var (cookie, _) = await SignInAsTeamMember(teamId);
        var contactId = await SeedContact(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, $"/api/contacts/{contactId}/notes");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { body = "Great meeting!" });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.True(body!.ContainsKey("id"));
    }

    [Fact]
    public async Task AddNote_BodyTooLong_Returns400()
    {
        var teamId = Guid.NewGuid();
        var (cookie, _) = await SignInAsTeamMember(teamId);
        var contactId = await SeedContact(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, $"/api/contacts/{contactId}/notes");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { body = new string('x', 4001) });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task UpdateNote_Author_Returns200()
    {
        var teamId = Guid.NewGuid();
        var (cookie, userId) = await SignInAsTeamMember(teamId);
        var contactId = await SeedContact(teamId);

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var note = new Note { TargetType = "Contact", TargetId = contactId, AuthorId = userId, Body = "Original" };
        db.Notes.Add(note);
        await db.SaveChangesAsync();

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Put, $"/api/notes/{note.Id}");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { body = "Edited" });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task AddNote_CrossTeamContact_Returns404()
    {
        var (cookie, _) = await SignInAsTeamMember(Guid.NewGuid());
        var contactId = await SeedContact(Guid.NewGuid()); // different team

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, $"/api/contacts/{contactId}/notes");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { body = "Sneaky note" });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task DeleteNote_NonAuthorNonAdmin_Returns403()
    {
        var teamId = Guid.NewGuid();
        var (authorCookie, authorId) = await SignInAsTeamMember(teamId, "CityLead");
        var (otherCookie, _) = await SignInAsTeamMember(teamId, "PrayerLead");
        var contactId = await SeedContact(teamId);

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var note = new Note { TargetType = "Contact", TargetId = contactId, AuthorId = authorId, Body = "Private" };
        db.Notes.Add(note);
        await db.SaveChangesAsync();

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Delete, $"/api/notes/{note.Id}");
        req.Headers.Add("Cookie", otherCookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }
}
