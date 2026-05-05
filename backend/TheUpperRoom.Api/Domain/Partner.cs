namespace TheUpperRoom.Api.Domain;

public enum PartnerStage { Lead, InFunnel, Confirmed }

public class Partner
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TeamId { get; set; }
    public string Name { get; set; } = "";
    public string? Website { get; set; }
    public string City { get; set; } = "";
    public PartnerStage Stage { get; set; } = PartnerStage.Lead;
    public string? Description { get; set; }
    public int Version { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public Guid? UpdatedById { get; set; }
    public DateTime? DeletedAt { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
