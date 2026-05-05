using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TheUpperRoom.Api.Domain;

namespace TheUpperRoom.Api.Auth;

public record ResetPasswordCommand(string Email, string Token, string NewPassword) : IRequest<ResetPasswordResult>;
public record ResetPasswordResult(bool Success, string? Error);

public class ResetPasswordCommandValidator : AbstractValidator<ResetPasswordCommand>
{
    public ResetPasswordCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Token).NotEmpty();
        RuleFor(x => x.NewPassword).NotEmpty().MinimumLength(12)
            .Matches("[a-z]").WithMessage("Password must contain a lowercase letter.")
            .Matches("[A-Z]").WithMessage("Password must contain an uppercase letter.")
            .Matches("[0-9]").WithMessage("Password must contain a digit.")
            .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain a symbol.");
    }
}

public class ResetPasswordCommandHandler(UserManager<User> userManager) : IRequestHandler<ResetPasswordCommand, ResetPasswordResult>
{
    public async Task<ResetPasswordResult> Handle(ResetPasswordCommand cmd, CancellationToken ct)
    {
        var user = await userManager.FindByEmailAsync(cmd.Email);
        if (user is null) return new(false, "expired_or_used");

        var result = await userManager.ResetPasswordAsync(user, cmd.Token, cmd.NewPassword);
        if (!result.Succeeded) return new(false, "expired_or_used");

        await userManager.UpdateSecurityStampAsync(user);
        return new(true, null);
    }
}
