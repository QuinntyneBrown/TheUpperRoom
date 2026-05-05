// Traces to: 09 — View Contact
// L2-010: get contact by id; 404 on cross-team; notes ordered desc
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Contacts;

public class GetContactTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<string> SignInAsTeamMember(Guid teamId)
    {
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"get+{Guid.NewGuid():N}@example.com";
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

    private async Task<Guid> SeedContact(Guid teamId, string firstName = "Ada", string lastName = "Lovelace")
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var contact = new Contact { TeamId = teamId, FirstName = firstName, LastName = lastName };
        db.Contacts.Add(contact);
        await db.SaveChangesAsync();
        return contact.Id;
    }

    [Fact]
    public async Task GetContact_OwnTeam_Returns200WithDto()
    {
        var teamId = Guid.NewGuid();
        var cookie = await SignInAsTeamMember(teamId);
        var contactId = await SeedContact(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, $"/api/contacts/{contactId}");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.Equal(contactId.ToString(), body!["id"].ToString());
    }

    [Fact]
    public async Task GetContact_CrossTeam_Returns404()
    {
        var team1 = Guid.NewGuid();
        var team2 = Guid.NewGuid();
        var cookie = await SignInAsTeamMember(team1);
        var contactId = await SeedContact(team2);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, $"/api/contacts/{contactId}");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetContact_NotFound_Returns404()
    {
        var teamId = Guid.NewGuid();
        var cookie = await SignInAsTeamMember(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, $"/api/contacts/{Guid.NewGuid()}");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetContact_Anonymous_Returns401()
    {
        var contactId = await SeedContact(Guid.NewGuid());
        var client = factory.CreateClient();
        var response = await client.GetAsync($"/api/contacts/{contactId}");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
