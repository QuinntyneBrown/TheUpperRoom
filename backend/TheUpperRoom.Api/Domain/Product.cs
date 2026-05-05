namespace TheUpperRoom.Api.Domain;

public class Product
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid HackathonId { get; set; }
    public string Name { get; set; } = "";
    public string? Description { get; set; }
    public string? RepoUrl { get; set; }
    public string? DemoUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? DeletedAt { get; set; }
}
