using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Hackathons;

public record AddProductCommand(
    Guid HackathonId,
    string Name,
    string? Description,
    string? RepoUrl,
    string? DemoUrl,
    Guid[] MemberUserIds,
    Guid[] MemberContactIds) : IRequest<Guid?>;

public class AddProductCommandValidator : AbstractValidator<AddProductCommand>
{
    public AddProductCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty();
        RuleFor(x => x.RepoUrl).Must(IsValidUrl).WithMessage("RepoUrl must be a valid http/https URL.");
        RuleFor(x => x.DemoUrl).Must(IsValidUrl).WithMessage("DemoUrl must be a valid http/https URL.");
    }

    private static bool IsValidUrl(string? url) =>
        url is null || (Uri.TryCreate(url, UriKind.Absolute, out var u) &&
                        (u.Scheme == Uri.UriSchemeHttp || u.Scheme == Uri.UriSchemeHttps));
}

public class AddProductCommandHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<AddProductCommand, Guid?>
{
    public async Task<Guid?> Handle(AddProductCommand cmd, CancellationToken ct)
    {
        var hackathon = await db.Hackathons.FirstOrDefaultAsync(
            h => h.Id == cmd.HackathonId && (currentUser.IsAdmin || h.TeamId == currentUser.TeamId), ct);
        if (hackathon is null) return null;

        var product = new Product
        {
            HackathonId = cmd.HackathonId,
            Name = cmd.Name,
            Description = cmd.Description,
            RepoUrl = cmd.RepoUrl,
            DemoUrl = cmd.DemoUrl,
        };
        db.Products.Add(product);

        foreach (var uid in cmd.MemberUserIds)
            db.ProductMembers.Add(new ProductMember { ProductId = product.Id, UserId = uid });

        foreach (var cid in cmd.MemberContactIds)
            db.ProductMembers.Add(new ProductMember { ProductId = product.Id, ContactId = cid });

        await db.SaveChangesAsync(ct);
        return product.Id;
    }
}
