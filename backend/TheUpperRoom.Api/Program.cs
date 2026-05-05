using System.Threading.RateLimiting;
using Microsoft.EntityFrameworkCore;
using FluentValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.RateLimiting;
using MediatR;
using TheUpperRoom.Api.Audit;
using TheUpperRoom.Api.Domain;
using TheUpperRoom.Api.Infrastructure;
using TheUpperRoom.Api.Observability;
using TheUpperRoom.Api.Realtime;
using TheUpperRoom.Api.Services;
using TheUpperRoom.Api.Validation;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables("THEUPPERROOM_");

builder.WebHost.ConfigureKestrel(o =>
    o.Limits.MaxRequestBodySize = 1 * 1024 * 1024); // 1 MB

builder.Services.AddControllers(o => o.Filters.Add<ValidationExceptionFilter>());
builder.Services.AddAntiforgery(o =>
{
    o.HeaderName = "X-CSRF-TOKEN";
    o.Cookie.Name = "XSRF-TOKEN";
    o.Cookie.SameSite = SameSiteMode.Strict;
});
builder.Services.AddRateLimiter(o =>
{
    o.AddFixedWindowLimiter("sign-in-ip", opts =>
    {
        opts.Window = TimeSpan.FromMinutes(1);
        opts.PermitLimit = 10;
        opts.QueueLimit = 0;
    });
    o.AddFixedWindowLimiter("recovery-email", opts =>
    {
        opts.Window = TimeSpan.FromHours(1);
        opts.PermitLimit = 3;
        opts.QueueLimit = 0;
    });
    o.OnRejected = async (ctx, _) =>
    {
        ctx.HttpContext.Response.StatusCode = 429;
        var retryAfter = ctx.Lease.TryGetMetadata(MetadataName.RetryAfter, out var ra)
            ? (int)ra.TotalSeconds : 60;
        await ctx.HttpContext.Response.WriteAsJsonAsync(
            new { error = "too_many_requests", retryAfterSeconds = retryAfter });
    };
});
builder.Services.AddHsts(options =>
{
    options.MaxAge = TimeSpan.FromDays(365);
    options.IncludeSubDomains = true;
});
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssemblyContaining<Program>();
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(TeamScopeBehavior<,>));
});
builder.Services.AddDbContext<AppDbContext>();
builder.Services.AddAuthentication(IdentityConstants.ApplicationScheme)
    .AddIdentityCookies();
builder.Services.ConfigureApplicationCookie(o =>
{
    o.Cookie.HttpOnly = true;
    o.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    o.Cookie.SameSite = SameSiteMode.Lax;
    o.ExpireTimeSpan = TimeSpan.FromMinutes(30);
    o.SlidingExpiration = true;
    o.LoginPath = "/auth/sign-in";
    o.Events.OnValidatePrincipal = async ctx =>
    {
        var issued = ctx.Properties.IssuedUtc;
        if (issued.HasValue && DateTimeOffset.UtcNow - issued.Value > TimeSpan.FromHours(12))
            ctx.RejectPrincipal();
        await Task.CompletedTask;
    };
});
builder.Services.AddIdentityCore<User>(o =>
    {
        o.Password.RequiredLength = 12;
        o.Password.RequireLowercase = true;
        o.Password.RequireUppercase = true;
        o.Password.RequireDigit = true;
        o.Password.RequireNonAlphanumeric = true;
        o.Lockout.MaxFailedAccessAttempts = 5;
        o.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    })
    .AddRoles<IdentityRole<Guid>>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddSignInManager()
    .AddDefaultTokenProviders();
builder.Services.AddSingleton<ApiMetrics>();
builder.Services.AddSingleton<EmailSender>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUser, CurrentUser>();
builder.Services.AddScoped<IUserClaimsPrincipalFactory<User>, AppUserClaimsPrincipalFactory>();
builder.Services.AddHostedService<SeedRolesService>();
builder.Services.AddScoped<IAuditLog, AuditLog>();
builder.Services.AddSignalR();
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
    scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.Migrate();

app.UseMiddleware<CorrelationMiddleware>();
app.UseMiddleware<ErrorMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();
app.UseRateLimiter();
app.UseCors();
app.UseHsts();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<TeamHub>("/hubs/team");
app.Run();

public partial class Program { }
