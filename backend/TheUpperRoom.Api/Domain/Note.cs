namespace TheUpperRoom.Api.Domain;

public class Note
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string TargetType { get; set; } = "Contact";
    public Guid TargetId { get; set; }
    public Guid AuthorId { get; set; }
    public string Body { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}
