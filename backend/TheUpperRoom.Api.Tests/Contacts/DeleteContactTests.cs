// Traces to: 11 — Delete Contact
// L2-012: soft delete; disappears from lists; 403 for lower roles; Admin restore
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Contacts;

public class DeleteContactTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<string> SignInWithRole(Guid teamId, string role)
    {
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"del+{Guid.NewGuid():N}@example.com";
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
        return resp.Headers.GetValues("Set-Cookie").First().Split(';')[0];
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
    public async Task DeleteContact_CityLead_Returns204AndSoftDeletes()
    {
        var teamId = Guid.NewGuid();
        var cookie = await SignInWithRole(teamId, Roles.CityLead);
        var contactId = await SeedContact(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Delete, $"/api/contacts/{contactId}");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        // Verify soft-deleted — default query filter hides it
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var found = db.Contacts.FirstOrDefault(c => c.Id == contactId);
        Assert.Null(found);

        // Verify it exists when ignoring filter
        var deleted = db.Contacts.IgnoreQueryFilters().First(c => c.Id == contactId);
        Assert.NotNull(deleted.DeletedAt);
    }

    [Fact]
    public async Task DeleteContact_PrayerLead_Returns403()
    {
        var teamId = Guid.NewGuid();
        var cookie = await SignInWithRole(teamId, Roles.PrayerLead);
        var contactId = await SeedContact(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Delete, $"/api/contacts/{contactId}");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task RestoreContact_Admin_Returns200AndRestores()
    {
        var teamId = Guid.NewGuid();
        var adminCookie = await SignInWithRole(teamId, Roles.Admin);
        var contactId = await SeedContact(teamId);

        // Soft-delete it first
        using (var scope = factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var contact = db.Contacts.First(c => c.Id == contactId);
            contact.DeletedAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
        }

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, $"/api/admin/contacts/{contactId}/restore");
        req.Headers.Add("Cookie", adminCookie);
        req.Content = JsonContent.Create(new { });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        using var verifyScope = factory.Services.CreateScope();
        var verifyDb = verifyScope.ServiceProvider.GetRequiredService<AppDbContext>();
        var restored = verifyDb.Contacts.FirstOrDefault(c => c.Id == contactId);
        Assert.NotNull(restored);
        Assert.Null(restored.DeletedAt);
    }

    [Fact]
    public async Task DeleteContact_CrossTeam_Returns404()
    {
        var team1 = Guid.NewGuid();
        var team2 = Guid.NewGuid();
        var cookie = await SignInWithRole(team1, Roles.CityLead);
        var contactId = await SeedContact(team2);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Delete, $"/api/contacts/{contactId}");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
