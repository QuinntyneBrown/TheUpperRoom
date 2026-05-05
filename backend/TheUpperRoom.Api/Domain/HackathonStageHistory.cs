namespace TheUpperRoom.Api.Domain;

public class HackathonStageHistory
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid HackathonId { get; set; }
    public HackathonStage FromStage { get; set; }
    public HackathonStage ToStage { get; set; }
    public Guid ChangedById { get; set; }
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
}
