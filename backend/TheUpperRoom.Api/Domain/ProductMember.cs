namespace TheUpperRoom.Api.Domain;

public class ProductMember
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ProductId { get; set; }
    public Guid? UserId { get; set; }
    public Guid? ContactId { get; set; }
}
