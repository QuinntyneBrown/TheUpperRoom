using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using TheUpperRoom.Api.Domain;

namespace TheUpperRoom.Api.Auth;

public record SignInCommand(string Email, string Password) : IRequest<SignInResult>;

public enum SignInResultStatus { Ok, InvalidCredentials, VerificationRequired, LockedOut }

public record SignInResult(SignInResultStatus Status);

public class SignInCommandValidator : AbstractValidator<SignInCommand>
{
    public SignInCommandValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress();
        RuleFor(x => x.Password).NotEmpty();
    }
}

public class SignInCommandHandler(SignInManager<User> signInManager) : IRequestHandler<SignInCommand, SignInResult>
{
    public async Task<SignInResult> Handle(SignInCommand cmd, CancellationToken ct)
    {
        var user = await signInManager.UserManager.FindByEmailAsync(cmd.Email);
        if (user is null) return new(SignInResultStatus.InvalidCredentials);

        if (!user.EmailConfirmed) return new(SignInResultStatus.VerificationRequired);

        var result = await signInManager.PasswordSignInAsync(
            user, cmd.Password, isPersistent: false, lockoutOnFailure: true);

        if (result.IsLockedOut) return new(SignInResultStatus.LockedOut);
        if (!result.Succeeded) return new(SignInResultStatus.InvalidCredentials);

        return new(SignInResultStatus.Ok);
    }
}
