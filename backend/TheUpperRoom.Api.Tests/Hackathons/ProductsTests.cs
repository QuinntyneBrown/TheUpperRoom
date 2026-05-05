// Traces to: 23 — Document Hackathon Products
// L2-024: add product persists; malformed URL rejected; members assigned
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Hackathons;

public class ProductsTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private async Task<(string cookie, Guid userId, Guid teamId)> SignIn()
    {
        var teamId = Guid.NewGuid();
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"prod+{Guid.NewGuid():N}@example.com";
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

    private async Task<Guid> SeedHackathon(Guid teamId)
    {
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var h = new Hackathon
        {
            TeamId = teamId,
            Title = "Prod Hackathon",
            StartDate = new DateOnly(2026, 6, 1),
            EndDate = new DateOnly(2026, 6, 3),
            HostCity = "Toronto",
        };
        db.Hackathons.Add(h);
        await db.SaveChangesAsync();
        return h.Id;
    }

    [Fact]
    public async Task AddProduct_NameOnly_Returns201AndPersists()
    {
        var (cookie, userId, teamId) = await SignIn();
        var hackathonId = await SeedHackathon(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, $"/api/hackathons/{hackathonId}/products");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new
        {
            name = "PrayerMate",
            description = (string?)null,
            repoUrl = (string?)null,
            demoUrl = (string?)null,
            memberUserIds = Array.Empty<Guid>(),
            memberContactIds = Array.Empty<Guid>()
        });

        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        var productId = Guid.Parse(body!["id"].ToString()!);

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var product = await db.Products.FindAsync(productId);
        Assert.NotNull(product);
        Assert.Equal("PrayerMate", product!.Name);
        Assert.Equal(hackathonId, product.HackathonId);
    }

    [Fact]
    public async Task AddProduct_MalformedUrl_Returns400()
    {
        var (cookie, _, teamId) = await SignIn();
        var hackathonId = await SeedHackathon(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, $"/api/hackathons/{hackathonId}/products");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new
        {
            name = "BadUrl",
            repoUrl = "not-a-url",
            memberUserIds = Array.Empty<Guid>(),
            memberContactIds = Array.Empty<Guid>()
        });

        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task AddProduct_WithMemberUser_MemberPersists()
    {
        var (cookie, userId, teamId) = await SignIn();
        var hackathonId = await SeedHackathon(teamId);

        var client = factory.CreateClient();
        var req = new HttpRequestMessage(HttpMethod.Post, $"/api/hackathons/{hackathonId}/products");
        req.Headers.Add("Cookie", cookie);
        req.Content = JsonContent.Create(new
        {
            name = "TeamApp",
            memberUserIds = new[] { userId },
            memberContactIds = Array.Empty<Guid>()
        });

        var response = await client.SendAsync(req);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<Dictionary<string, object>>();
        var productId = Guid.Parse(body!["id"].ToString()!);

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var member = db.ProductMembers.FirstOrDefault(m => m.ProductId == productId && m.UserId == userId);
        Assert.NotNull(member);
    }
}
