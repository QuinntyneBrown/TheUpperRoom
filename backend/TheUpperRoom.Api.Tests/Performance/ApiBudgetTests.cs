// Traces to: 64 — API load and seeded data budget harness
// L2-047: GET p95 < 300ms, mutation p95 < 500ms, search p95 < 700ms (50 VUs, 60 s)
using Microsoft.AspNetCore.Mvc.Testing;
using System.Diagnostics;
using System.Net.Http.Json;

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
        var ms = await MeasureP95Async(client, () => client.GetAsync("/api/health"), VirtualUsers);
        Assert.True(ms < P95GetMs, $"Health p95={ms}ms exceeded budget {P95GetMs}ms");
    }

    [Fact(Skip = "Endpoint not yet implemented — enable when slice 08 lands")]
    public async Task Contacts_Get_P95_WithinGetBudget()
    {
        var client = factory.CreateClient();
        var ms = await MeasureP95Async(client, () => client.GetAsync("/api/contacts?page=1&pageSize=25"), VirtualUsers);
        Assert.True(ms < P95GetMs, $"GET /api/contacts p95={ms}ms exceeded budget {P95GetMs}ms");
    }

    [Fact(Skip = "Endpoint not yet implemented — enable when slice 15 lands")]
    public async Task Partners_Get_P95_WithinGetBudget()
    {
        var client = factory.CreateClient();
        var ms = await MeasureP95Async(client, () => client.GetAsync("/api/partners"), VirtualUsers);
        Assert.True(ms < P95GetMs, $"GET /api/partners p95={ms}ms exceeded budget {P95GetMs}ms");
    }

    [Fact(Skip = "Endpoint not yet implemented — enable when slice 34 lands")]
    public async Task GlobalSearch_P95_WithinSearchBudget()
    {
        var client = factory.CreateClient();
        var ms = await MeasureP95Async(client, () => client.GetAsync("/api/search?q=test"), VirtualUsers);
        Assert.True(ms < P95SearchMs, $"GET /api/search p95={ms}ms exceeded budget {P95SearchMs}ms");
    }

    [Fact(Skip = "Endpoint not yet implemented — enable when slice 08 lands")]
    public async Task Contacts_Post_P95_WithinMutationBudget()
    {
        var client = factory.CreateClient();
        var ms = await MeasureP95Async(
            client,
            () => client.PostAsJsonAsync("/api/contacts", new { firstName = "Perf", lastName = "Test", email = "perf@test.com" }),
            VirtualUsers);
        Assert.True(ms < P95MutationMs, $"POST /api/contacts p95={ms}ms exceeded budget {P95MutationMs}ms");
    }

    // Fires `count` concurrent requests and returns the p95 latency in ms.
    private static async Task<long> MeasureP95Async(HttpClient _, Func<Task<HttpResponseMessage>> request, int count)
    {
        var timings = new long[count];
        var tasks = Enumerable.Range(0, count).Select(async i =>
        {
            var sw = Stopwatch.StartNew();
            await request();
            timings[i] = sw.ElapsedMilliseconds;
        });
        await Task.WhenAll(tasks);
        Array.Sort(timings);
        var p95Index = (int)Math.Ceiling(count * 0.95) - 1;
        return timings[Math.Max(0, p95Index)];
    }
}
