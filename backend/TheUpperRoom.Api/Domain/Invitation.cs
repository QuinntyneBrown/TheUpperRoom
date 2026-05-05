namespace TheUpperRoom.Api.Domain;

public class Invitation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Email { get; set; } = "";
    public Guid TeamId { get; set; }
    public string RoleNames { get; set; } = ""; // csv
    public string Token { get; set; } = ""; // raw token stored for test simplicity; hash in production
    public Guid CreatedById { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public DateTime? AcceptedAt { get; set; }
}
