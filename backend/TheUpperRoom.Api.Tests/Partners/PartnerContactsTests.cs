// Traces to: 17 — Associate Contacts with Partner
// L2-018: add/remove/create-and-link; cross-team rejected; contact remains after disassociation
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Partners;

public class PartnerContactsTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<(string cookie, Guid userId, Guid teamId)> SignIn()
    {
        var teamId = Guid.NewGuid();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"pct+{Guid.NewGuid():N}@example.com";
        const string password = "Str0ng!Pass#99";
        await client.PostAsJsonAsync("/api/auth/register",
            new { email, password, displayName = "Lead", city = "Toronto" });
        using var scope = factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var user = db.Users.First(u => u.Email == email);
        user.EmailConfirmed = true;
        user.TeamId = teamId;
        await db.SaveChangesAsync();
        await userManager.AddToRoleAsync(user, Roles.CityLead);
        var resp = await client.PostAsJsonAsync("/api/auth/sign-in", new { email, password });
        return (resp.Headers.GetValues("Set-Cookie").First().Split(';')[0], user.Id, teamId);
    }

    private async Task<Guid> SeedPartner(Guid teamId)
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var partner = new Partner { TeamId = teamId, Name = "Test Church", City = "Toronto" };
        db.Partners.Add(partner);
        await db.SaveChangesAsync();
        return partner.Id;
    }

    private async Task<Guid> SeedContact(Guid teamId)
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var contact = new Contact { TeamId = teamId, FirstName = "Sam", LastName = "Reyes", Email = "sam@test.com" };
        db.Contacts.Add(contact);
        await db.SaveChangesAsync();
        return contact.Id;
    }

    [Fact]
    public async Task AddContact_Returns200AndLinkPersists()
    {
        var (cookie, _, teamId) = await SignIn();
        var partnerId = await SeedPartner(teamId);
        var contactId = await SeedContact(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, $"/api/partners/{partnerId}/contacts");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { contactId });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        Assert.True(db.PartnerContacts.Any(pc => pc.PartnerId == partnerId && pc.ContactId == contactId));
    }

    [Fact]
    public async Task AddContact_CrossTeamPartner_Returns404()
    {
        var (cookie, _, _) = await SignIn();
        var partnerId = await SeedPartner(Guid.NewGuid());
        var (_, _, teamId2) = await SignIn();
        var contactId = await SeedContact(teamId2);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, $"/api/partners/{partnerId}/contacts");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { contactId });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task RemoveContact_Returns204_ContactRemainsInTeam()
    {
        var (cookie, _, teamId) = await SignIn();
        var partnerId = await SeedPartner(teamId);
        var contactId = await SeedContact(teamId);

        using (var scope = factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            db.PartnerContacts.Add(new PartnerContact { PartnerId = partnerId, ContactId = contactId });
            await db.SaveChangesAsync();
        }

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Delete, $"/api/partners/{partnerId}/contacts/{contactId}");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        using var scope2 = factory.Services.CreateScope();
        var db2 = scope2.ServiceProvider.GetRequiredService<AppDbContext>();
        Assert.False(db2.PartnerContacts.Any(pc => pc.PartnerId == partnerId && pc.ContactId == contactId));
        Assert.True(db2.Contacts.Any(c => c.Id == contactId));
    }

    [Fact]
    public async Task CreateAndLink_Returns201_PersistsBoth()
    {
        var (cookie, _, teamId) = await SignIn();
        var partnerId = await SeedPartner(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, $"/api/partners/{partnerId}/contacts/new");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { firstName = "Sam", lastName = "Reyes", email = "sam@faithtech.com" });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        var contactId = Guid.Parse(body!["contactId"].ToString()!);

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        Assert.True(db.Contacts.Any(c => c.Id == contactId && c.TeamId == teamId));
        Assert.True(db.PartnerContacts.Any(pc => pc.PartnerId == partnerId && pc.ContactId == contactId));
    }
}
