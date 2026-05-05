// Traces to: 41 — Contact Audit and Restore View
// L2-012 AC3: Admin lists deleted contacts; non-admin gets 403; restore returns contact to default list
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Admin;

public class DeletedContactsTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<string> SignInWithRole(Guid teamId, string role)
    {
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"adm+{Guid.NewGuid():N}@example.com";
        const string pw = "Str0ng!Pass#99";
        await client.PostAsJsonAsync("/api/auth/register", new { email, password = pw, displayName = "User", city = "City" });
        using var scope = factory.Services.CreateScope();
        var um = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var user = db.Users.First(u => u.Email == email);
        user.EmailConfirmed = true;
        user.TeamId = teamId;
        await db.SaveChangesAsync();
        await um.AddToRoleAsync(user, role);
        var resp = await client.PostAsJsonAsync("/api/auth/sign-in", new { email, password = pw });
        return resp.Headers.GetValues("Set-Cookie").First().Split(';')[0];
    }

    private async Task<Guid> SeedDeletedContact(Guid teamId, string name = "Deleted User")
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var contact = new Contact
        {
            TeamId = teamId,
            FirstName = name.Split(' ')[0],
            LastName = name.Split(' ').Last(),
            DeletedAt = DateTime.UtcNow,
        };
        db.Contacts.Add(contact);
        await db.SaveChangesAsync();
        return contact.Id;
    }

    [Fact]
    public async Task ListDeleted_Admin_Returns200WithDeletedContacts()
    {
        var teamId = Guid.NewGuid();
        var cookie = await SignInWithRole(teamId, Roles.Admin);
        var contactId = await SeedDeletedContact(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/admin/contacts/deleted");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<DeletedContactDto[]>();
        Assert.NotNull(body);
        Assert.Contains(body, c => c.Id == contactId);
    }

    [Fact]
    public async Task ListDeleted_NonAdmin_Returns403()
    {
        var teamId = Guid.NewGuid();
        var cookie = await SignInWithRole(teamId, Roles.CityLead);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/admin/contacts/deleted");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task ListDeleted_OnlyReturnsDeletedContacts()
    {
        var teamId = Guid.NewGuid();
        var cookie = await SignInWithRole(teamId, Roles.Admin);

        // Seed an active contact
        Guid activeId;
        using (var scope = factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var active = new Contact { TeamId = teamId, FirstName = "Active", LastName = "User" };
            db.Contacts.Add(active);
            await db.SaveChangesAsync();
            activeId = active.Id;
        }
        var deletedId = await SeedDeletedContact(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/admin/contacts/deleted");
        req.Headers.Add("Cookie", cookie);
        var body = await (await client.SendAsync(req)).Content.ReadFromJsonAsync<DeletedContactDto[]>();

        Assert.NotNull(body);
        Assert.DoesNotContain(body, c => c.Id == activeId);
        Assert.Contains(body, c => c.Id == deletedId);
    }
}

file record DeletedContactDto(Guid Id, string Name, DateTime DeletedAt, Guid TeamId);
