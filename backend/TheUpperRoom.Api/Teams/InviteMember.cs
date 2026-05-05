using System.Security.Cryptography;
using MediatR;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;
using TheUpperRoom.Api.Services;

namespace TheUpperRoom.Api.Teams;

public record InviteMemberCommand(string Email, string[] Roles) : IRequest;

public class InviteMemberCommandHandler(
    AppDbContext db,
    ICurrentUser currentUser,
    EmailSender emailSender,
    IConfiguration config) : IRequestHandler<InviteMemberCommand>
{
    public async Task Handle(InviteMemberCommand cmd, CancellationToken ct)
    {
        var rawToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));

        db.Invitations.Add(new Invitation
        {
            Email = cmd.Email,
            TeamId = currentUser.TeamId ?? Guid.Empty,
            RoleNames = string.Join(",", cmd.Roles),
            Token = rawToken,
            CreatedById = currentUser.Id ?? Guid.Empty,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
        });
        await db.SaveChangesAsync(ct);

        var baseUrl = config["App:BaseUrl"] ?? "http://localhost:5000";
        var link = $"{baseUrl}/auth/register?invite={Uri.EscapeDataString(rawToken)}";
        await emailSender.SendAsync(cmd.Email, "You've been invited to The Upper Room",
            $"Click the link to join your team: {link}");
    }
}
