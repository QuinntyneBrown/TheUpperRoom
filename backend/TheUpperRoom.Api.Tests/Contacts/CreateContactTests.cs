// Traces to: 08 — Create Contact
// L2-009: create contact with optional notes; validation rules; team scoping
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Contacts;

public class CreateContactTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<string> SignInAsTeamMember(Guid teamId)
    {
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"contact+{Guid.NewGuid():N}@example.com";
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

    [Fact]
    public async Task CreateContact_ValidRequest_Returns201WithId()
    {
        var teamId = Guid.NewGuid();
        var cookie = await SignInAsTeamMember(teamId);
        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, "/api/contacts");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new
        {
            firstName = "Ava",
            lastName = "Lee",
            teamId
        });

        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.True(body!.ContainsKey("id"));
    }

    [Fact]
    public async Task CreateContact_MissingFirstName_Returns400()
    {
        var teamId = Guid.NewGuid();
        var cookie = await SignInAsTeamMember(teamId);
        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, "/api/contacts");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { lastName = "Lee", teamId });

        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateContact_InvalidEmail_Returns400()
    {
        var teamId = Guid.NewGuid();
        var cookie = await SignInAsTeamMember(teamId);
        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, "/api/contacts");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new
        {
            firstName = "Ava",
            lastName = "Lee",
            email = "not-an-email",
            teamId
        });

        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateContact_WithNotes_SavesNote()
    {
        var teamId = Guid.NewGuid();
        var cookie = await SignInAsTeamMember(teamId);
        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, "/api/contacts");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new
        {
            firstName = "Ava",
            lastName = "Lee",
            notes = "Met at partner kickoff.",
            teamId
        });

        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        var id = Guid.Parse(body!["id"].ToString()!);

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var note = db.Notes.FirstOrDefault(n => n.ContactId == id);
        Assert.NotNull(note);
        Assert.Equal("Met at partner kickoff.", note.Body);
    }
}
