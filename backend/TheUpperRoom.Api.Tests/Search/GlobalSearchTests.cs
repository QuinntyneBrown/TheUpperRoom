// Traces to: 34 — Global Search
// L2-043: search returns grouped results (contacts, partners, hackathons, members)
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Search;

public class GlobalSearchTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<(string cookie, Guid userId, Guid teamId)> SignInAs(string role, Guid? teamId = null)
    {
        var tid = teamId ?? Guid.NewGuid();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"search+{Guid.NewGuid():N}@example.com";
        const string password = "Str0ng!Pass#99";
        await client.PostAsJsonAsync("/api/auth/register", new { email, password, displayName = "User", city = "Toronto" });
        using var scope = factory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var user = db.Users.First(u => u.Email == email);
        user.EmailConfirmed = true;
        user.TeamId = tid;
        await db.SaveChangesAsync();
        await userManager.AddToRoleAsync(user, role);
        var resp = await client.PostAsJsonAsync("/api/auth/sign-in", new { email, password });
        return (resp.Headers.GetValues("Set-Cookie").First().Split(';')[0], user.Id, tid);
    }

    [Fact]
    public async Task Search_Returns200WithGroupedResults()
    {
        var (cookie, _, _) = await SignInAs(Roles.CityLead);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/search?q=test");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        Assert.NotNull(body);
        Assert.True(body!.ContainsKey("contacts"));
        Assert.True(body.ContainsKey("partners"));
        Assert.True(body.ContainsKey("hackathons"));
        Assert.True(body.ContainsKey("members"));
    }

    [Fact]
    public async Task Search_MatchesContactByName()
    {
        var (cookie, _, teamId) = await SignInAs(Roles.CityLead);
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Contacts.Add(new Contact
        {
            TeamId = teamId,
            FirstName = "Unique",
            LastName = "Searchperson",
            CreatedAt = DateTime.UtcNow,
        });
        await db.SaveChangesAsync();

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Get, "/api/search?q=Searchperson");
        req.Headers.Add("Cookie", cookie);
        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        var contacts = System.Text.Json.JsonSerializer.Deserialize<List<Dictionary<string, object>>>(body!["contacts"].ToString()!);
        Assert.NotNull(contacts);
        Assert.NotEmpty(contacts!);
    }

    [Fact]
    public async Task Search_Unauthenticated_Returns401()
    {
        var client = factory.CreateClient();
        var resp = await client.GetAsync("/api/search?q=test");
        Assert.Equal(HttpStatusCode.Unauthorized, resp.StatusCode);
    }
}
