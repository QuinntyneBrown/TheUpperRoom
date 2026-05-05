using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Dashboards;

public record SaveDashboardCommand(string Json) : IRequest;

public class SaveDashboardValidator : AbstractValidator<SaveDashboardCommand>
{
    public SaveDashboardValidator()
    {
        RuleFor(x => x.Json)
            .NotEmpty()
            .MaximumLength(16384)
            .Must(json =>
            {
                try
                {
                    using var doc = JsonDocument.Parse(json);
                    return doc.RootElement.TryGetProperty("items", out _);
                }
                catch { return false; }
            })
            .WithMessage("Must be valid JSON with an 'items' array and ≤16 KB.");
    }
}

public class SaveDashboardCommandHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<SaveDashboardCommand>
{
    public async Task Handle(SaveDashboardCommand cmd, CancellationToken ct)
    {
        var userId = currentUser.Id!.Value;
        var existing = await db.DashboardLayouts.FindAsync([userId], ct);
        if (existing is null)
        {
            db.DashboardLayouts.Add(new DashboardLayout { UserId = userId, Json = cmd.Json, UpdatedAt = DateTime.UtcNow });
        }
        else
        {
            existing.Json = cmd.Json;
            existing.UpdatedAt = DateTime.UtcNow;
        }
        await db.SaveChangesAsync(ct);
    }
}
