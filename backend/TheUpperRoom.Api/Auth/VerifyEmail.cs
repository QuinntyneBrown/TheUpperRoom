using System.Security.Cryptography;
using System.Text;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Auth;

public record VerifyEmailCommand(string Token) : IRequest<VerifyEmailResult>;
public record VerifyEmailResult(bool Success, string? Error);

public class VerifyEmailCommandHandler(AppDbContext db) : IRequestHandler<VerifyEmailCommand, VerifyEmailResult>
{
    public async Task<VerifyEmailResult> Handle(VerifyEmailCommand cmd, CancellationToken ct)
    {
        var tokenHash = Convert.ToBase64String(SHA256.HashData(Encoding.UTF8.GetBytes(cmd.Token)));
        var vt = await db.VerificationTokens.FirstOrDefaultAsync(t => t.TokenHash == tokenHash, ct);

        if (vt is null || vt.UsedAt.HasValue || vt.ExpiresAt < DateTime.UtcNow)
            return new(false, "expired_or_used");

        var user = await db.Users.FindAsync([vt.UserId], ct);
        if (user is null) return new(false, "expired_or_used");

        vt.UsedAt = DateTime.UtcNow;
        user.EmailConfirmed = true;
        await db.SaveChangesAsync(ct);

        return new(true, null);
    }
}
