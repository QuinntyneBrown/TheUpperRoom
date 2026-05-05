using FluentValidation;
using MediatR;
using TheUpperRoom.Api.Audit;
using TheUpperRoom.Api.Infrastructure;
using TheUpperRoom.Api.Observability;
using TheUpperRoom.Api.Validation;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.ConfigureKestrel(o =>
    o.Limits.MaxRequestBodySize = 1 * 1024 * 1024); // 1 MB

builder.Services.AddControllers(o => o.Filters.Add<ValidationExceptionFilter>());
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
app.UseCors();
app.UseHsts();
app.UseHttpsRedirection();
app.MapControllers();
app.Run();

public partial class Program { }
