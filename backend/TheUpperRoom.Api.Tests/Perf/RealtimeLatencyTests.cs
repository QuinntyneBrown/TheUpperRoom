// Traces to: 52 — Realtime Latency Budget Harness
// L2-048: 100 events, p95 ≤ 2 s, p99 ≤ 5 s
// Skipped by default — set env REALTIME_LATENCY=true to run
using System.Collections.Concurrent;
using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.DependencyInjection;

namespace TheUpperRoom.Api.Tests.Perf;

public class RealtimeLatencyTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    private static readonly bool Enabled = Environment.GetEnvironmentVariable("REALTIME_LATENCY") == "true";

    private async Task<(HttpClient client, string cookie, Guid teamId)> CreateUserInTeam(
        string email, Guid? teamId = null)
    {
        var client = factory.CreateClient(new WebApplicationFactoryClientOptions { AllowAutoRedirect = false });
        const string password = "Str0ng!Pass#99";
        await client.PostAsJsonAsync("/api/auth/register", new { email, password, displayName = "Latency User", city = "Toronto" });

        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<TheUpperRoom.Api.Infrastructure.AppDbContext>();
        var user = db.Users.First(u => u.Email == email);
        user.EmailConfirmed = true;
        var resolvedTeamId = teamId ?? Guid.NewGuid();
        user.TeamId = resolvedTeamId;
        await db.SaveChangesAsync();

        var signInResp = await client.PostAsJsonAsync("/api/auth/sign-in", new { email, password });
        var cookie = signInResp.Headers.GetValues("Set-Cookie").First().Split(';')[0];
        return (client, cookie, resolvedTeamId);
    }

    private HubConnection BuildHubConnection(string cookie)
    {
        var handler = factory.Server.CreateHandler();
        return new HubConnectionBuilder()
            .WithUrl("http://localhost/hubs/team", o =>
            {
                o.HttpMessageHandlerFactory = _ => handler;
                o.Headers.Add("Cookie", cookie);
            })
            .Build();
    }

    [Fact]
    public async Task Latency_100Events_P95Under2s_P99Under5s()
    {
        if (!Enabled)
        {
            // Skip when REALTIME_LATENCY is not set
            Assert.True(true, "Skipped — set REALTIME_LATENCY=true to run");
            return;
        }

        const int eventCount = 100;
        var emailA = $"lat+a{Guid.NewGuid():N}@example.com";
        var emailB = $"lat+b{Guid.NewGuid():N}@example.com";

        var (clientA, cookieA, teamId) = await CreateUserInTeam(emailA);
        var (_, cookieB, _) = await CreateUserInTeam(emailB, teamId);

        var hubB = BuildHubConnection(cookieB);
        var latencies = new ConcurrentBag<double>();
        var received = new SemaphoreSlim(0, eventCount);

        hubB.On<JsonElement>("contactCreated", evt =>
        {
            if (evt.TryGetProperty("timestamp", out var ts) &&
                DateTime.TryParse(ts.GetString(), out var sentAt))
            {
                latencies.Add((DateTime.UtcNow - sentAt.ToUniversalTime()).TotalMilliseconds);
            }
            received.Release();
        });

        await hubB.StartAsync();

        for (int i = 0; i < eventCount; i++)
        {
            var req = new HttpRequestMessage(HttpMethod.Post, "/api/contacts");
            req.Headers.Add("Cookie", cookieA);
            req.Content = JsonContent.Create(new
            {
                firstName = $"Lat{i}",
                lastName = "Test",
                teamId = teamId.ToString(),
            });
            await clientA.SendAsync(req);
        }

        var allReceived = await received.WaitAsync(TimeSpan.FromSeconds(30));
        await hubB.StopAsync();

        Assert.True(allReceived || latencies.Count >= eventCount,
            $"Only received {latencies.Count}/{eventCount} events within 30s");

        var sorted = latencies.OrderBy(l => l).ToList();
        var p95 = Percentile(sorted, 95);
        var p99 = Percentile(sorted, 99);
        var p50 = Percentile(sorted, 50);

        var artifact = new
        {
            p50 = Math.Round(p50, 2),
            p95 = Math.Round(p95, 2),
            p99 = Math.Round(p99, 2),
            count = sorted.Count,
            timestamp = DateTime.UtcNow.ToString("O"),
        };

        var artifactDir = Environment.GetEnvironmentVariable("GITHUB_WORKSPACE") ?? ".";
        await File.WriteAllTextAsync(
            Path.Combine(artifactDir, "realtime-latency.json"),
            JsonSerializer.Serialize(artifact, new JsonSerializerOptions { WriteIndented = true }));

        Assert.True(p95 <= 2000, $"p95 latency {p95:F0}ms exceeds 2000ms budget");
        Assert.True(p99 <= 5000, $"p99 latency {p99:F0}ms exceeds 5000ms budget");
    }

    private static double Percentile(List<double> sorted, int p)
    {
        if (sorted.Count == 0) return 0;
        var idx = (int)Math.Ceiling(p / 100.0 * sorted.Count) - 1;
        return sorted[Math.Max(0, Math.Min(idx, sorted.Count - 1))];
    }
}
