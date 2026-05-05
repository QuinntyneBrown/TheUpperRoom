using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace TheUpperRoom.Api.Infrastructure;

public class SeedRolesService(IServiceScopeFactory scopeFactory) : IHostedService
{
    public async Task StartAsync(CancellationToken ct)
    {
        using var scope = scopeFactory.CreateScope();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<Guid>>>();
        foreach (var role in Roles.All)
        {
            if (await roleManager.RoleExistsAsync(role)) continue;
            try
            {
                await roleManager.CreateAsync(new IdentityRole<Guid>(role));
            }
            catch (DbUpdateException)
            {
                // Concurrent WAF instances may race to seed the same roles; ignore duplicates.
            }
        }
    }

    public Task StopAsync(CancellationToken ct) => Task.CompletedTask;
}
