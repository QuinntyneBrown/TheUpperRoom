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
    public DbSet<PartnerStageHistory> PartnerStageHistories => Set<PartnerStageHistory>();
    public DbSet<PartnerContact> PartnerContacts => Set<PartnerContact>();
    public DbSet<Hackathon> Hackathons => Set<Hackathon>();
    public DbSet<HackathonPartner> HackathonPartners => Set<HackathonPartner>();
    public DbSet<HackathonStageHistory> HackathonStageHistories => Set<HackathonStageHistory>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<Contact>().HasQueryFilter(c => c.DeletedAt == null);
        builder.Entity<Note>().HasQueryFilter(n => n.DeletedAt == null);
        builder.Entity<Partner>().HasQueryFilter(p => p.DeletedAt == null);
        builder.Entity<Hackathon>().HasQueryFilter(h => h.DeletedAt == null);
        builder.Entity<PartnerContact>().HasKey(pc => new { pc.PartnerId, pc.ContactId });
        builder.Entity<HackathonPartner>().HasKey(hp => new { hp.HackathonId, hp.PartnerId });
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
            optionsBuilder.UseSqlite("Data Source=app.db");
    }
}
