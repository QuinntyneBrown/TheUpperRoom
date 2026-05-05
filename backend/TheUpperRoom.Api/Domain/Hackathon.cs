namespace TheUpperRoom.Api.Domain;

public enum HackathonStage { Discover, Define, Design, Develop, Launch }

public class Hackathon
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TeamId { get; set; }
    public string Title { get; set; } = "";
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string HostCity { get; set; } = "";
    public HackathonStage Stage { get; set; } = HackathonStage.Discover;
    public int Version { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedAt { get; set; }
}
