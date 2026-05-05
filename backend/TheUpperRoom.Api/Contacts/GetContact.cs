using MediatR;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Infrastructure;

namespace TheUpperRoom.Api.Contacts;

public record NoteDto(Guid Id, string Body, Guid AuthorId, DateTime CreatedAt);

public record ContactDto(
    Guid Id,
    Guid TeamId,
    string FirstName,
    string LastName,
    string? Email,
    string? Phone,
    string? City,
    int Version,
    DateTime? UpdatedAt,
    NoteDto[] Notes);

public record GetContactQuery(Guid Id) : IRequest<ContactDto?>;

public class GetContactQueryHandler(AppDbContext db, ICurrentUser currentUser)
    : IRequestHandler<GetContactQuery, ContactDto?>
{
    public async Task<ContactDto?> Handle(GetContactQuery query, CancellationToken ct)
    {
        var contact = await db.Contacts
            .Include(c => c.Notes)
            .FirstOrDefaultAsync(c => c.Id == query.Id, ct);

        if (contact is null) return null;

        if (!currentUser.IsAdmin && currentUser.TeamId != contact.TeamId) return null;

        return new ContactDto(
            contact.Id,
            contact.TeamId,
            contact.FirstName,
            contact.LastName,
            contact.Email,
            contact.Phone,
            contact.City,
            contact.Version,
            contact.UpdatedAt,
            contact.Notes
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new NoteDto(n.Id, n.Body, n.AuthorId, n.CreatedAt))
                .ToArray());
    }
}
