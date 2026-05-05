namespace TheUpperRoom.Api.Domain;

public class Note
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ContactId { get; set; }
    public Guid AuthorId { get; set; }
    public string Body { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
