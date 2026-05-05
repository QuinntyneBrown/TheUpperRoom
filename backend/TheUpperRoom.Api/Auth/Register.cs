using System.Security.Cryptography;
using System.Text;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;
using TheUpperRoom.Api.Services;

namespace TheUpperRoom.Api.Auth;

public record RegisterCommand(string Email, string Password, string DisplayName, string City) : IRequest;

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty().MinimumLength(12)
            .Matches("[a-z]").WithMessage("Password must contain a lowercase letter.")
            .Matches("[A-Z]").WithMessage("Password must contain an uppercase letter.")
            .Matches("[0-9]").WithMessage("Password must contain a digit.")
            .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain a symbol.");
        RuleFor(x => x.DisplayName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.City).NotEmpty().MaximumLength(100);
    }
}

public class RegisterCommandHandler(
    UserManager<User> userManager,
    AppDbContext db,
    EmailSender emailSender,
    IConfiguration config) : IRequestHandler<RegisterCommand>
{
    public async Task Handle(RegisterCommand cmd, CancellationToken ct)
    {
        var existing = await userManager.FindByEmailAsync(cmd.Email);
        if (existing != null) return; // Generic — no enumeration

        var user = new User
        {
            Email = cmd.Email,
            UserName = cmd.Email,
            DisplayName = cmd.DisplayName,
            City = cmd.City
        };

        var result = await userManager.CreateAsync(user, cmd.Password);
        if (!result.Succeeded) return;

        var rawToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(32));
        var tokenHash = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(rawToken)));

        db.VerificationTokens.Add(new VerificationToken
        {
            UserId = user.Id,
            TokenHash = tokenHash,
            ExpiresAt = DateTime.UtcNow.AddHours(24)
        });
        await db.SaveChangesAsync(ct);

        var baseUrl = config["App:BaseUrl"] ?? "http://localhost:5000";
        var link = $"{baseUrl}/api/auth/verify?token={Uri.EscapeDataString(rawToken)}";
        await emailSender.SendAsync(cmd.Email, "Verify your account",
            $"Click the link to verify your account: {link}");
    }
}
