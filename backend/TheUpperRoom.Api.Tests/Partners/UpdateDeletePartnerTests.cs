// Traces to: 19 — View, Update, Delete Partner
// L2-020: update with version, soft-delete detaches contacts, lower roles get 403
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Partners;

public class UpdateDeletePartnerTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<(string cookie, Guid userId, Guid teamId)> SignIn(string role = Roles.CityLead)
    {
        var teamId = Guid.NewGuid();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"udp+{Guid.NewGuid():N}@example.com";
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
        await userManager.AddToRoleAsync(user, role);
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

    [Fact]
    public async Task UpdatePartner_ValidRequest_Returns200AndPersists()
    {
        var (cookie, _, teamId) = await SignIn();
        var partnerId = await SeedPartner(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Put, $"/api/partners/{partnerId}");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { name = "Updated Church", city = "Ottawa", version = 0 });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var partner = db.Partners.First(p => p.Id == partnerId);
        Assert.Equal("Updated Church", partner.Name);
        Assert.Equal("Ottawa", partner.City);
    }

    [Fact]
    public async Task UpdatePartner_StaleVersion_Returns409()
    {
        var (cookie, _, teamId) = await SignIn();
        var partnerId = await SeedPartner(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Put, $"/api/partners/{partnerId}");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new { name = "Updated", city = "Ottawa", version = 99 });
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
    }

    [Fact]
    public async Task DeletePartner_CityLead_Returns204AndSoftDeletes()
    {
        var (cookie, _, teamId) = await SignIn(Roles.CityLead);
        var partnerId = await SeedPartner(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Delete, $"/api/partners/{partnerId}");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var partner = await db.Partners.IgnoreQueryFilters().FirstAsync(p => p.Id == partnerId);
        Assert.NotNull(partner.DeletedAt);
    }

    [Fact]
    public async Task DeletePartner_DetachesContacts()
    {
        var (cookie, _, teamId) = await SignIn(Roles.CityLead);
        var partnerId = await SeedPartner(teamId);

        using (var scope = factory.Services.CreateScope())
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var contact = new Contact { TeamId = teamId, FirstName = "A", LastName = "B" };
            db.Contacts.Add(contact);
            db.PartnerContacts.Add(new PartnerContact { PartnerId = partnerId, ContactId = contact.Id });
            await db.SaveChangesAsync();
        }

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Delete, $"/api/partners/{partnerId}");
        req.Headers.Add("Cookie", cookie);
        await client.SendAsync(req);

        using var scope2 = factory.Services.CreateScope();
        var db2 = scope2.ServiceProvider.GetRequiredService<AppDbContext>();
        Assert.False(db2.PartnerContacts.Any(pc => pc.PartnerId == partnerId));
    }

    [Fact]
    public async Task DeletePartner_PrayerLead_Returns403()
    {
        var (cookie, _, teamId) = await SignIn(Roles.PrayerLead);
        var partnerId = await SeedPartner(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Delete, $"/api/partners/{partnerId}");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }
}
