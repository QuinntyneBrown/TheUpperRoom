// Traces to: 14 — List & Paginate Contacts
// L2-015: 25/page default, sort lastName asc, total count returned
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Contacts;

public class ListContactsTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<string> SignInAsTeamMember(Guid teamId)
    {
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"list+{Guid.NewGuid():N}@example.com";
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

    private async Task SeedContacts(Guid teamId, int count)
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        for (var i = 0; i < count; i++)
            db.Contacts.Add(new Contact { TeamId = teamId, FirstName = $"First{i:D3}", LastName = $"Last{i:D3}" });
        await db.SaveChangesAsync();
    }

    [Fact]
    public async Task List_DefaultPage_Returns25Rows()
    {
        var teamId = Guid.NewGuid();
        var cookie = await SignInAsTeamMember(teamId);
        await SeedContacts(teamId, 30);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/contacts");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<ListResult>();
        Assert.Equal(25, body!.Rows.Count);
        Assert.Equal(30, body.Total);
    }

    [Fact]
    public async Task List_Page2_ReturnsRemaining()
    {
        var teamId = Guid.NewGuid();
        var cookie = await SignInAsTeamMember(teamId);
        await SeedContacts(teamId, 30);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/contacts?page=2&size=25");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<ListResult>();
        Assert.Equal(5, body!.Rows.Count);
        Assert.Equal(30, body.Total);
    }

    [Fact]
    public async Task List_SortedLastNameAsc_FirstAlphabetically()
    {
        var teamId = Guid.NewGuid();
        var cookie = await SignInAsTeamMember(teamId);
        await SeedContacts(teamId, 3);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/contacts?sort=lastName:asc");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<ListResult>();
        var lastNames = body!.Rows.Select(r => r.GetProperty("lastName").GetString()).ToList();
        Assert.Equal(lastNames.OrderBy(x => x).ToList(), lastNames);
    }

    [Fact]
    public async Task List_CrossTeamContacts_NotIncluded()
    {
        var teamId = Guid.NewGuid();
        var cookie = await SignInAsTeamMember(teamId);

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Contacts.Add(new Contact { TeamId = Guid.NewGuid(), FirstName = "OtherTeam", LastName = "Excluded" });
        await db.SaveChangesAsync();

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/contacts");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<ListResult>();
        Assert.DoesNotContain(body!.Rows, r => r.GetProperty("lastName").GetString() == "Excluded");
    }

    private record ListResult(List<System.Text.Json.JsonElement> Rows, int Total);
}
