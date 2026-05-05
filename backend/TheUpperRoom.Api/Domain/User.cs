using Microsoft.AspNetCore.Identity;

namespace TheUpperRoom.Api.Domain;

public class User : IdentityUser<Guid>
{
    public string DisplayName { get; set; } = "";
    public string City { get; set; } = "";
}
