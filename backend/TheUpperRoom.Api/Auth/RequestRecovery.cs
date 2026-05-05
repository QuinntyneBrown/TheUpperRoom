using MediatR;
using Microsoft.AspNetCore.Identity;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Services;

namespace TheUpperRoom.Api.Auth;

public record RequestRecoveryCommand(string Email) : IRequest;

public class RequestRecoveryCommandHandler(
    UserManager<User> userManager,
    EmailSender emailSender,
    IConfiguration config) : IRequestHandler<RequestRecoveryCommand>
{
    public async Task Handle(RequestRecoveryCommand cmd, CancellationToken ct)
    {
        var user = await userManager.FindByEmailAsync(cmd.Email);
        if (user is null) return; // Generic — no enumeration

        var token = await userManager.GeneratePasswordResetTokenAsync(user);
        var baseUrl = config["App:BaseUrl"] ?? "http://localhost:4200";
        var link = $"{baseUrl}/auth/reset?token={Uri.EscapeDataString(token)}&email={Uri.EscapeDataString(cmd.Email)}";
        await emailSender.SendAsync(cmd.Email, "Reset your password",
            $"Click the link to reset your password (valid 1 hour): {link}");
    }
}
