// Traces to: 64 — API load and seeded data budget harness
// L2-047: GET p95 < 300ms, mutation p95 < 500ms, search p95 < 700ms (50 VUs, 60 s)
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics;
using System.Net.Http.Json;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Tests.Performance;

public class ApiBudgetTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private const int VirtualUsers = 50;
    private const int P95GetMs = 300;
    private const int P95MutationMs = 500;
    private const int P95SearchMs = 700;

    [Fact]
    public async Task Health_P95_WithinGetBudget()
    {
        var client = factory.CreateClient();
        var ms = await MeasureP95Async(() => client.GetAsync("/api/health"), VirtualUsers);
        Assert.True(ms < P95GetMs, $"Health p95={ms}ms exceeded budget {P95GetMs}ms");
    }

    [Fact]
    public async Task Contacts_Get_P95_WithinGetBudget()
    {
        var client = await AuthenticatedClientAsync();
        var ms = await MeasureP95Async(() => client.GetAsync("/api/contacts?page=1&pageSize=25"), VirtualUsers);
        Assert.True(ms < P95GetMs, $"GET /api/contacts p95={ms}ms exceeded budget {P95GetMs}ms");
    }

    [Fact]
    public async Task Partners_Get_P95_WithinGetBudget()
    {
        var client = await AuthenticatedClientAsync();
        var ms = await MeasureP95Async(() => client.GetAsync("/api/partners"), VirtualUsers);
        Assert.True(ms < P95GetMs, $"GET /api/partners p95={ms}ms exceeded budget {P95GetMs}ms");
    }

    [Fact]
    public async Task GlobalSearch_P95_WithinSearchBudget()
    {
        var client = await AuthenticatedClientAsync();
        var ms = await MeasureP95Async(() => client.GetAsync("/api/search?q=test"), VirtualUsers);
        Assert.True(ms < P95SearchMs, $"GET /api/search p95={ms}ms exceeded budget {P95SearchMs}ms");
    }

    [Fact]
    public async Task Contacts_Post_P95_WithinMutationBudget()
    {
        var client = await AuthenticatedClientAsync();
        var ms = await MeasureP95Async(
            () => client.PostAsJsonAsync("/api/contacts", new
            {
                firstName = "Perf",
                lastName = "Test",
                email = $"perf+{Guid.NewGuid():N}@example.com",
            }),
            VirtualUsers);
        Assert.True(ms < P95MutationMs, $"POST /api/contacts p95={ms}ms exceeded budget {P95MutationMs}ms");
    }

    private async Task<HttpClient> AuthenticatedClientAsync()
    {
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        var email = $"perf+{Guid.NewGuid():N}@example.com";
        const string password = "Str0ng!Pass#99";

        await client.PostAsJsonAsync("/api/auth/register", new { email, password, displayName = "Perf", city = "PerfCity" });

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        var user = db.Users.First(u => u.Email == email);
        user.EmailConfirmed = true;
        await db.SaveChangesAsync();

        var signIn = await client.PostAsJsonAsync("/api/auth/sign-in", new { email, password });
        var result = await signIn.Content.ReadFromJsonAsync<SignInResult>();
        client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", result!.Token);
        return client;
    }

    private static async Task<long> MeasureP95Async(Func<Task<HttpResponseMessage>> request, int count)
    {
        var timings = new long[count];
        await Task.WhenAll(Enumerable.Range(0, count).Select(async i =>
        {
            var sw = Stopwatch.StartNew();
            await request();
            timings[i] = sw.ElapsedMilliseconds;
        }));
        Array.Sort(timings);
        return timings[(int)Math.Ceiling(count * 0.95) - 1];
    }

    private record SignInResult(string Token);
}
