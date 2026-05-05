namespace TheUpperRoom.Api.Domain;

public class DashboardLayout
{
    public Guid UserId { get; set; }
    public string Json { get; set; } = """{"items":[]}""";
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
