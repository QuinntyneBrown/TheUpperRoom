namespace TheUpperRoom.Api.Domain;

public class Contact
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid TeamId { get; set; }
    public string FirstName { get; set; } = "";
    public string LastName { get; set; } = "";
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? City { get; set; }
    public List<Note> Notes { get; set; } = [];
}
