using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TheUpperRoom.Api.Domain;

namespace TheUpperRoom.Api.Infrastructure;

public class AppDbContext(DbContextOptions<AppDbContext> options)
    : IdentityDbContext<User, IdentityRole<Guid>, Guid>(options)
{
    public DbSet<VerificationToken> VerificationTokens => Set<VerificationToken>();
    public DbSet<Contact> Contacts => Set<Contact>();
    public DbSet<Note> Notes => Set<Note>();
    public DbSet<Partner> Partners => Set<Partner>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<Contact>().HasQueryFilter(c => c.DeletedAt == null);
        builder.Entity<Note>().HasQueryFilter(n => n.DeletedAt == null);
        builder.Entity<Partner>().HasQueryFilter(p => p.DeletedAt == null);
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
            optionsBuilder.UseSqlite("Data Source=app.db");
    }
}
