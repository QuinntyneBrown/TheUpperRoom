namespace TheUpperRoom.Api.Domain;

public class PartnerStageHistory
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid PartnerId { get; set; }
    public PartnerStage FromStage { get; set; }
    public PartnerStage ToStage { get; set; }
    public Guid ChangedById { get; set; }
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
}
