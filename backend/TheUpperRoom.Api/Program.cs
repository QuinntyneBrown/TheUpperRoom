using System.Threading.RateLimiting;
using FluentValidation;
using Microsoft.AspNetCore.RateLimiting;
using MediatR;
using TheUpperRoom.Api.Audit;
using TheUpperRoom.Api.Infrastructure;
using TheUpperRoom.Api.Observability;
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
});
builder.Services.AddDbContext<AppDbContext>();
builder.Services.AddSingleton<ApiMetrics>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IAuditLog, AuditLog>();
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.UseMiddleware<CorrelationMiddleware>();
app.UseMiddleware<ErrorMiddleware>();
app.UseMiddleware<RequestLoggingMiddleware>();
app.UseRateLimiter();
app.UseCors();
app.UseHsts();
app.UseHttpsRedirection();
app.MapControllers();
app.Run();

public partial class Program { }
