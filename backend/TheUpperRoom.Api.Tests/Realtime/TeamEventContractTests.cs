// Traces to: 51 — Team Event Envelope Contract
// AC3: every published envelope includes eventType, entityId, actorId, timestamp, data
using System.Text.Json;
using TheUpperRoom.Api.Realtime;

namespace TheUpperRoom.Api.Tests.Realtime;

public class TeamEventContractTests
{
    [Fact]
    public void TeamEvent_SerializesToJson_WithAllFiveFields()
    {
        var evt = new TeamEvent(
            EventType: "contactCreated",
            EntityId: Guid.NewGuid(),
            ActorId: Guid.NewGuid(),
            Timestamp: DateTime.UtcNow,
            Data: new { Id = Guid.NewGuid() });

        var json = JsonSerializer.Serialize(evt, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        Assert.True(root.TryGetProperty("eventType", out _), "envelope missing eventType");
        Assert.True(root.TryGetProperty("entityId", out _), "envelope missing entityId");
        Assert.True(root.TryGetProperty("actorId", out _), "envelope missing actorId");
        Assert.True(root.TryGetProperty("timestamp", out _), "envelope missing timestamp");
        Assert.True(root.TryGetProperty("data", out _), "envelope missing data");
    }

    [Fact]
    public void TeamEvent_NonNullFields_WhenConstructedByBroadcast()
    {
        var teamId = Guid.NewGuid();
        var entityId = Guid.NewGuid();
        var actorId = Guid.NewGuid();
        var evt = new TeamEvent("contactCreated", entityId, actorId, DateTime.UtcNow, new { Id = entityId });

        Assert.NotEqual(default, evt.EventType);
        Assert.NotEqual(Guid.Empty, evt.EntityId);
        Assert.NotNull(evt.ActorId);
        Assert.NotEqual(default, evt.Timestamp);
        Assert.NotNull(evt.Data);
    }
}
